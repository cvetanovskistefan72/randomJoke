class AppPostError {
  constructor(errorObj) {
    this.errorObj = errorObj;
  }
  getObjectErrors() {
    const errors = Object.entries(this.errorObj).reduce((acc, [k, v]) => {
      return { ...acc, [k]: v.message };
    }, {});
    return errors;
  }
}

module.exports = AppPostError;
