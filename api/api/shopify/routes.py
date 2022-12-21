import os
import shopify
import json
import binascii
from dotenv import load_dotenv
from api import app, db
from api.jwt_token.__token_required__ import token_required
from flask import Response, request, redirect, url_for

load_dotenv()
shopify_api_key = os.environ.get('SHOPIFY_API_KEY')
shopify_shared_secret = os.environ.get('SHOPIFY_SHARED_SECRET')


# shop_url = "https://%s:%s@SHOP_NAME.myshopify.com/admin" % (shopify_api_key, shopify_shared_secret)
# shopify.ShopifyResource.set_site(shop_url)

shopify.Session.setup(api_key=shopify_api_key, secret=shopify_shared_secret)


@app.route("/api/shopify/store/")
def shop_login():
    shop = request.args.get('shop', '')
    scope = ["read_products"]

    # instantiate shop session
    shop_session = shopify.Session(shop)

    # store shop session in session repository
    # session['shopify'] = store_session(shop_session)
    # session['myshopify_domain'] = shop

    permission_url = shop_session.create_permission_url(scope,
        url_for('retrieve_token', _external=True))

    return redirect(permission_url) # redirect to Shopify to initiate installation

@app.route("/api/shopify/store/auth/callback")
def retrieve_token():
    shop_url = "seolynn.myshopify.com"
    api_version = '2022-04'
    state = binascii.b2a_hex(os.urandom(15)).decode("utf-8")
    redirect_uri = 'http://localhost:5000/api/shopify/store'
    scopes = ['read_products', 'read_orders']

    newSession = shopify.Session(shop_url, api_version)
    auth_url = newSession.create_permission_url(scopes, redirect_uri, state)
    # redirect to auth_url

    session = shopify.Session(shop_url, api_version)

    # Uh, what the fuck do I pass in? What are these "request_params," can this part be explained clearly?
    access_token = session.request_token(request.args) # request_token will validate hmac and timing attacks
    # you should save the access token now for future use.

    session = shopify.Session(shop_url, api_version, access_token)
    shopify.ShopifyResource.activate_session(session)

    return redirect(url_for('get_shopify_store'))

@app.route('/api/shopify/store', methods=['GET'])
def get_shopify_store():

    """

    """

    shop = shopify.Shop.current() # Get the current shop
   

    # execute a graphQL call
    shopify.GraphQL().execute("{ shop { name id } }")
    

    return Response(json.dumps({"store" : shop}), mimetype='application/json')