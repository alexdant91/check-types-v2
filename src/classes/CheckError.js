class CheckError {
  constructor(key, type, replace) {
    this.messages = {
      'required': 'Field is required.',
      'type_error': 'Data type check error.',
      'not_match': 'Must match %str% pattern.',
      'not_enum': 'Value must be one of ["%str%"].'
    };
    this.key = key;
    this.type = type;
    this.replace = replace || null;
    this.isReplace = this.replace == null;
    this.isReplaceArray = Array.isArray(this.replace);

    return this.buildError();
  }

  buildError = () => {
    let message = this.messages[this.type] != undefined ? this.messages[this.type] : 'Unknown Error.';

    if (this.isReplace && !this.isReplaceArray) message = message.replace('%str%', this.replace);
    if (this.isReplace && this.isReplaceArray) message = message.replace('%str%', this.replace.join('", "'));

    return {
      key: this.key,
      type: this.messages[this.type] != undefined ? this.type : 'unknown_error',
      message
    }
  }
}

export default CheckError;
