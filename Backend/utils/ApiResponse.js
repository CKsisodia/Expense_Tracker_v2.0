class ApiResponse {
  constructor(message = "success", data) {
    this.data = data;
    this.message = message;
  }
  toJSON() {
    return {
      status: true,
      message: this.message,
      data: this.data,
    };
  }
}

module.exports = ApiResponse;
