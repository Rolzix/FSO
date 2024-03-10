const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
const password = process.argv[2];

const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://rolzi:${password}@cluster0.xfblkqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    const personSchema = new mongoose.Schema({
      name: String,
      number: Number,
    });

    const Person = mongoose.model("Person", personSchema);

    if (password && process.argv.length < 4) {
      console.log("phonebook:");
      Person.find({ name: { $exists: true } })
        .then((result) => {
          result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
          });
          mongoose.connection.close();
          process.exit(1);
        })
        .catch((error) => {
          console.error("Error fetching persons:", error);
          mongoose.connection.close();
          process.exit(1);
        });
    }
    if (password && name && number) {
      const person = new Person({
        name: name,
        number: number,
      });
      person.save().then((result) => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
        process.exit(0);
      });
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
