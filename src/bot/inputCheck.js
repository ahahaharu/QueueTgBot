function inputCheck(input) {
    console.log(input)

    const cleanedInput = input.replace(/\s/g, '');

    const labRegex = /^(\d(,\d)*)$/;
    if (!labRegex.test(cleanedInput)) {
      return false;
    }

    const labNumbers = cleanedInput.split(',').map(Number);

    for (let num of labNumbers) {
      if (num < 1 || num > 8) {
        return false;
      }
    }

    return true;
  }

module.exports = {inputCheck}