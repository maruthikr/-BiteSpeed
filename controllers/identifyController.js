const Contact = require("../models/Contact");

exports.identify = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber required" });
  }

  try {
    const existingContacts = await Contact.find({
      $or: [{ email }, { phoneNumber }]
    });

    let primaryContact;

    if (existingContacts.length === 0) {
      // Create new primary contact
      primaryContact = await Contact.create({ email, phoneNumber, linkPrecedence: "primary" });
    } else {
      // Determine primary contact
      const primaries = existingContacts.filter(c => c.linkPrecedence === "primary");
      primaries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      primaryContact = primaries[0];

      // Update other primaries to secondary
      await Promise.all(existingContacts.map(async contact => {
        if (contact._id.toString() !== primaryContact._id.toString() && contact.linkPrecedence === "primary") {
          contact.linkPrecedence = "secondary";
          contact.linkedId = primaryContact._id;
          await contact.save();
        }
      }));

      // Create a new secondary if current input doesn't match any existing contact
      const alreadyExists = existingContacts.some(c =>
        (email && c.email === email) || (phoneNumber && c.phoneNumber === phoneNumber)
      );

      if (!alreadyExists) {
        await Contact.create({
          email,
          phoneNumber,
          linkedId: primaryContact._id,
          linkPrecedence: "secondary"
        });
      }
    }

    // Fetch related contacts: primary + all secondaries
    const relatedContacts = await Contact.find({
      $or: [
        { _id: primaryContact._id },
        { linkedId: primaryContact._id }
      ]
    });

    const emails = [...new Set(relatedContacts.map(c => c.email).filter(Boolean))];
    const phoneNumbers = [...new Set(relatedContacts.map(c => c.phoneNumber).filter(Boolean))];
    const secondaryContactIds = relatedContacts
      .filter(c => c.linkPrecedence === "secondary")
      .map(c => c._id);

    return res.json({
      contact: {
        primaryContactId: primaryContact._id,
        emails,
        phoneNumbers,
        secondaryContactIds
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
