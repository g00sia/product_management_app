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
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from sqlalchemy.orm import relationship

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
ma = Marshmallow(app)
CORS(app)

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.String(200), nullable = False)
    description = db.Column(db.String(500), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    date_created = db.Column(db.DateTime, default = datetime.utcnow )
    is_deleted = db.Column(db.Boolean, default = False)
    comments = db.relationship('Comment', backref='product', lazy=True)

    def __repr__(self):
        return '<Product %r>' % self.id
    

    
class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable = False)
    creationDate = db.Column(db.DateTime, default = datetime.utcnow)
    isDeleted = db.Column(db.Boolean, default = False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable = False)

    def __repr__(self):
        return '<Comment %r>' % self.id
    
class CommentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
   
class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
@app.route('/getdata', methods = ['POST', 'GET'])
def index():
    if request.method == "POST":
        try:
            data = request.get_json()  # Pobierz dane w formacie JSON
            product_content = data.get('content')
            product_description = data.get('description')
            product_image_url = data.get('image_url')
            new_product = Product(content=product_content, description=product_description, image_url=product_image_url)

            db.session.add(new_product)
            db.session.commit()
            return jsonify({ "id": new_product.id,
                "content": new_product.content,
                "description": new_product.description,
                "image_url": new_product.image_url,
                "date_created": new_product.date_created.isoformat()})
        except:
            return jsonify({"error": "There was an issue"})
        
    else:
        try:
            page = int(request.args.get('page', 1))
            page_size = int(request.args.get('pageSize', 5))
            products = Product.query.filter_by(is_deleted = False).order_by(Product.date_created.desc()).paginate(page=page, per_page=page_size, error_out=False)
            products_json = [{"id": product.id, "content": product.content,"description": product.description, "image_url": product.image_url, "date_created": product.date_created.isoformat()} for product in products.items]
            return jsonify(products_json)
        except Exception as e:
            return jsonify({"error": f"There was an issue: {str(e)}"})
        
@app.route('/getTotalPages', methods=['GET'])
def get_total_pages():
    try:
        page_size = int(request.args.get('pageSize', 5))
        total_tasks = Product.query.filter_by(is_deleted=False).count()
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
        results = Product.query.filter_by(is_deleted = False).filter(Product.content.ilike(f"%{q}%")).order_by(Product.date_created).paginate(page=page, per_page=page_size, error_out=False)
        results_json = [{"id": product.id, "content": product.content, "description": product.description,
                "image_url":product.image_url, "date_created": product.date_created.isoformat()} for product in results]
        return jsonify({"results": results_json})
    else: 
        return jsonify({"results": []})

    
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    product_to_delete = Product.query.get_or_404(id)
    try:
        product_to_delete.is_deleted = True
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"})
    
    except:
        return jsonify({"error": "There was a problem deleting that task"})

    

@app.route('/update/<int:id>', methods = ['GET', 'POST'])
def edit(id):
    product = Product.query.get_or_404(id)

    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            product.content = data.get('content', product.content)
            product.description = data.get('description', product.description)
            product.image_url = data.get('image_url', product.image_url)

        else:
            product.content = request.form.get('content', product.content)

        try:
            db.session.commit()
            return jsonify({"message": "Task updated successfully"})
        except Exception as e:
            return jsonify({"error": f"There was an issue updating the task: {str(e)}"})
        


        
@app.route('/api/products/<int:product_id>/comments', methods=['POST'])
def add_comment_to_product(product_id):
    data = request.get_json()

    if 'content' not in data:
        return jsonify({'error': 'Missing comment content'}), 400

    product = db.session.get(Product, product_id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    new_comment = Comment(content=data['content'], product=product)
    db.session.add(new_comment)
    db.session.commit()
    product = Product.query.get(product_id)
    

    # Zwróć zaktualizowany produkt, włączając komentarze
    updated_product = db.session.get(Product, product_id)
    product_schema = ProductSchema()
    result = product_schema.dump(updated_product)

    return jsonify(result), 201
    
    
@app.route('/get_comments/<int:product_id>', methods=['GET'])
def get_comments(product_id):
    try:
        comments = Comment.query.filter_by(product_id=product_id).order_by(Comment.date_created).all()
        comments_schema = CommentSchema(many=True)
        comments_json = comments_schema.dump(comments)
        return jsonify({"comments": comments_json})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    
    app.run(debug = True)

