from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/")
def home():
    # Real Client IP header set by Nginx
    client_ip = request.headers.get("X-Real-IP", request.remote_addr)
    return jsonify({
        "status": "success",
        "message": "Hello from Flask behind Nginx!",
        "client_ip": client_ip
    })

@app.route("/health")
def health():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
