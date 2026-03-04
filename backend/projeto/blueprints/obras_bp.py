from flask import Blueprint, jsonify, request
import requests

obras_bp = Blueprint("obras_bp", __name__)