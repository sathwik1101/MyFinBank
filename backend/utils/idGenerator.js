const generateId = async (Model, field, prefix, padLength = 4) => {
  let isUnique = false;
  let newId;

  // Find the highest existing ID instead of counting documents
  const last = await Model.findOne({ [field]: new RegExp(`^${prefix}-`) })
    .sort({ [field]: -1 })
    .select(field);

  let counter = 0;
  if (last) {
    const parts = last[field].split('-');
    counter = parseInt(parts[parts.length - 1]) || 0;
  }

  while (!isUnique) {
    counter++;
    const number = String(counter).padStart(padLength, '0');
    newId = `${prefix}-${number}`;
    const existing = await Model.findOne({ [field]: newId });
    if (!existing) isUnique = true;
  }

  return newId;
};

module.exports = generateId;