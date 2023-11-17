from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from sqlalchemy.sql import func
import os
from flask import jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.String(200), nullable = False)
    date_created = db.Column(db.DateTime, default = datetime.utcnow )
    is_deleted = db.Column(db.Boolean, default = False)

    def __repr__(self):
        return '<Task %r>' % self.id
data =[
    {"id": 1, "name": "Produkt A", "price": 20.0},
    {"id": 2, "name": "Produkt B", "price": 30.0},
    {"id": 3, "name": "Produkt C", "price": 25.0}
]

@app.route('/api', methods=['GET'])
def proba():
    json_data = json.dumps(data, indent = 4)
    return json_data


@app.route('/dupa', methods = ['POST', 'GET'])
def index():
    if request.method == "POST":
        try:
            data = request.get_json()  # Pobierz dane w formacie JSON
            task_content = data.get('content')
            new_task = Todo(content=task_content)

            db.session.add(new_task)
            db.session.commit()
            return jsonify({ "id": new_task.id,
                "content": new_task.content,
                "date_created": new_task.date_created.isoformat()})
        except:
            return jsonify({"error": "There was an issue"})
        
    else:
        tasks = Todo.query.filter_by(is_deleted = False).order_by(Todo.date_created).all()
        tasks_json = [{"id": task.id, "content": task.content, "date_created": task.date_created.isoformat()} for task in tasks]
        json_data = json.dumps(tasks_json, indent = 4)
        return jsonify(tasks_json)
        
    

    
@app.route("/search")
def search():
    q = request.args.get("q")
    print(q)
    if q:
        results = Todo.query.filter_by(is_deleted = False).filter(Todo.content.icontains(q)).order_by(Todo.date_created).all()
        results_json = [{"id": task.id, "content": task.content, "date_created": task.date_created} for task in results]
        return jsonify({"results": results_json})
    else: 
        return jsonify({"results": []})

    
@app.route('/delete/<int:id>')
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)

    try:
        task_to_delete.is_deleted = True
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"})
    
    except:
        return jsonify({"error": "There was a problem deleting that task"})

    

@app.route('/update/<int:id>', methods = ['GET', 'POST'])
def update(id):
    task = Todo.query.get_or_404(id)

    if request.method=='POST':
        task.content = request.form['content']

        try:
            db.session.commit()
            return jsonify({"message": "Task updated successfully"})
        except:
           return jsonify({"error": "There was an issue updating the task"})

if __name__ == "__main__":
    
    app.run(debug = True)

