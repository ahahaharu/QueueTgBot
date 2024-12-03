function inputCheck(input, labsCount) {

    const cleanedInput = input.trim().replace(/[\s,]+/g, ','); 

    const labRegex = /^(\d+(,\d+)*)$/;
    if (!labRegex.test(cleanedInput)) {
      return "";
    }

    const labNumbers = cleanedInput.split(',').map(Number);
    for (let num of labNumbers) {
      if (num < 1 || num > labsCount) {
        return "";
      }
    }

    return labNumbers.join(', ');
  }

module.exports = {inputCheck}