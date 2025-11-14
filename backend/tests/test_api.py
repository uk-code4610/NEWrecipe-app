import pytest
from app import app, db


@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()


def test_register_success(client):
    data = {"username": "testuser", "password": "testpass123"}
    response = client.post("/api/register", json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_register_duplicate(client):
    data = {"username": "testuser", "password": "testpass123"}
    client.post("/api/register", json=data)

    response = client.post("/api/register", json=data)

    assert response.status_code == 200
    assert response.json["status"] == "error"
    assert "ユーザー名は既に存在します" in response.json["message"]


def test_login_success(client):

    data = {"username": "loginuser", "password": "loginpass123"}
    client.post("/api/register", json=data)

    response = client.post("/api/login", json=data)

    assert response.status_code == 200
    assert response.json["status"] == "success"
    assert "ログインに成功しました" in response.json["message"]


def test_login_wrong_password(client):

    client.post(
        "/api/register", json={"username": "loginuser", "password": "correctpass"}
    )

    response = client.post(
        "/api/login", json={"username": "loginuser", "password": "wrongpass"}
    )

    assert response.status_code == 200
    assert response.json["status"] == "error"
