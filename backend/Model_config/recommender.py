import json
import numpy as np
from sklearn.feature_extraction import DictVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def load_data():
    """Loads product and user data from JSON files."""
    try:
        with open('products.json', 'r') as f:
            products = json.load(f)
        with open('user_profile.json', 'r') as f:
            user_data = json.load(f)
        return products, user_data
    except FileNotFoundError as e:
        print(f"Error: Missing file. Please make sure products.json and user_profile.json exist. {e}")
        return None, None

def preprocess_products(products):
    """
    Converts product attributes into a numerical feature matrix.
    Uses DictVectorizer for one-hot encoding of categorical features.
    """
    product_attributes = []
    for product in products:
        attributes = {'category': product['category'], 'color': product['color']}
        product_attributes.append(attributes)

    vectorizer = DictVectorizer(sparse=False)
    product_matrix = vectorizer.fit_transform(product_attributes)

    return product_matrix, vectorizer

def get_recommendations(user_profile, products, product_matrix, vectorizer):
    """
    Generates recommendations based on a user's wishlist and cart.
    1. Averages the feature vectors of the user's preferred items.
    2. Calculates cosine similarity between the user's average vector and all products.
    3. Ranks and returns the top recommendations.
    """
    preferred_product_ids = []
    preferred_product_ids.extend(user_profile.get('wishlist', []))
    preferred_product_ids.extend(user_profile.get('cart', []))

    if not preferred_product_ids:
        print("User has no wishlist or cart items. Cannot generate recommendations.")
        return []

    preferred_vectors = []
    for product_id in preferred_product_ids:
        for product in products:
            if product['id'] == product_id:
                product_dict = {'category': product['category'], 'color': product['color']}
                vector = vectorizer.transform([product_dict])
                preferred_vectors.append(vector)
                break
    
    if not preferred_vectors:
        return []

    user_preference_vector = np.mean(preferred_vectors, axis=0)
    similarities = cosine_similarity(user_preference_vector.reshape(1, -1), product_matrix)
    
    similar_product_indices = np.argsort(similarities[0])[::-1]
    
    recommendations = []
    for index in similar_product_indices:
        product = products[index]
        if product['id'] not in preferred_product_ids:
            recommendations.append({
                'id': product['id'],
                'name': product['name'],
                'score': similarities[0][index]
            })

    return recommendations[:10]

if __name__ == "__main__":
    products_data, user_profiles = load_data()

    if products_data and user_profiles:
        product_matrix, vectorizer = preprocess_products(products_data)

        for user_id, profile in user_profiles.items():
            print(f"\n--- Recommended Products for {user_id} ---")
            recommendations = get_recommendations(profile, products_data, product_matrix, vectorizer)
            if recommendations:
                for i, rec in enumerate(recommendations):
                    print(f"{i+1}. {rec['name']} (Score: {rec['score']:.2f})")
            else:
                print("No recommendations found.")