from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from sqlalchemy.sql import func
import os
from flask import jsonify
from flask_cors import CORS
import json
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.String(200), nullable = False)
    description = db.Column(db.String(500), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    date_created = db.Column(db.DateTime, default = datetime.utcnow )
    is_deleted = db.Column(db.Boolean, default = False)

    def __repr__(self):
        return '<Task %r>' % self.id


@app.route('/getdata', methods = ['POST', 'GET'])
def index():
    if request.method == "POST":
        try:
            data = request.get_json()  # Pobierz dane w formacie JSON
            task_content = data.get('content')
            task_description = data.get('description')
            task_image_url = data.get('image_url')
            new_task = Todo(content=task_content, description=task_description, image_url=task_image_url)

            db.session.add(new_task)
            db.session.commit()
            return jsonify({ "id": new_task.id,
                "content": new_task.content,
                "description": new_task.description,
                "image_url": new_task.image_url,
                "date_created": new_task.date_created.isoformat()})
        except:
            return jsonify({"error": "There was an issue"})
        
    else:
        try:
            page = int(request.args.get('page', 1))
            page_size = int(request.args.get('pageSize', 5))
            tasks = Todo.query.filter_by(is_deleted = False).order_by(Todo.date_created.desc()).paginate(page=page, per_page=page_size, error_out=False)
            tasks_json = [{"id": task.id, "content": task.content,"description": task.description, "image_url": task.image_url, "date_created": task.date_created.isoformat()} for task in tasks.items]
            return jsonify(tasks_json)
        except Exception as e:
            return jsonify({"error": f"There was an issue: {str(e)}"})
        
@app.route('/getTotalPages', methods=['GET'])
def get_total_pages():
    try:
        page_size = int(request.args.get('pageSize', 5))
        total_tasks = Todo.query.filter_by(is_deleted=False).count()
        total_pages = (total_tasks + page_size - 1) // page_size
        return jsonify({'totalPages': total_pages})
    except Exception as e:
        return jsonify({'error': str(e)})    

    
@app.route("/search")
def search():
    q = request.args.get("q")
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 5))
    print(q)
    if q:
        results = Todo.query.filter_by(is_deleted = False).filter(Todo.content.ilike(f"%{q}%")).order_by(Todo.date_created).paginate(page=page, per_page=page_size, error_out=False)
        results_json = [{"id": task.id, "content": task.content, "description": task.description,
                "image_url":task.image_url, "date_created": task.date_created.isoformat()} for task in results]
        return jsonify({"results": results_json})
    else: 
        return jsonify({"results": []})

    
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)
    try:
        task_to_delete.is_deleted = True
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"})
    
    except:
        return jsonify({"error": "There was a problem deleting that task"})

    

@app.route('/update/<int:id>', methods = ['GET', 'POST'])
def edit(id):
    print("JESTEM TUTAJ!")
    task = Todo.query.get_or_404(id)

    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            task.content = data.get('content', task.content)
            task.description = data.get('description', task.description)
            task.image_url = data.get('image_url', task.image_url)

        else:
            task.content = request.form.get('content', task.content)

        try:
            db.session.commit()
            return jsonify({"message": "Task updated successfully"})
        except Exception as e:
            return jsonify({"error": f"There was an issue updating the task: {str(e)}"})

if __name__ == "__main__":
    
    app.run(debug = True)

