class ApiError extends Error {
  constructor(message = "Internal server error") {
    super(message);
  }
  toJSON() {
    return {
      status: false,
      message: this.message,
    };
  }
}

module.exports = ApiError;
