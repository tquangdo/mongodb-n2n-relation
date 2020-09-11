const mongoose = require("mongoose");
const modelColle = require("./models");

//~~~~~~~~~~~~~~~~~~~~~~~createTutorial~~~~~~~~~~~~~~~~~~~~~~~~~
const createTutorial = function (tutorial) {
  return modelColle.Tutorial.create(tutorial).then(docTutorial => {
    return docTutorial;
  });
};
//~~~~~~~~~~~~~~~~~~~~~~~createTag~~~~~~~~~~~~~~~~~~~~~~~~~
const createTag = function (tag) {
  return modelColle.Tag.create(tag).then(docTag => {
    return docTag;
  });
};
//~~~~~~~~~~~~~~~~~~~~~~~addTagToTutorial~~~~~~~~~~~~~~~~~~~~~~~~~
const addTagToTutorial = function (tutorialId, tag) {
  return modelColle.Tutorial.findByIdAndUpdate(
    tutorialId,
    { $push: { tags: tag._id } },
    { new: true, useFindAndModify: false }
  );
};
//~~~~~~~~~~~~~~~~~~~~~addTutorialToTag~~~~~~~~~~~~~~~~~~~~~~~~~~~
const addTutorialToTag = function (tagId, tutorial) {
  return modelColle.Tag.findByIdAndUpdate(
    tagId,
    { $push: { tutorials: tutorial._id } },
    { new: true, useFindAndModify: false }
  );
};
//~~~~~~~~~~~~~~~~~~~~~getTutorialWithPopulate~~~~~~~~~~~~~~~~~~~~~~~~~~~
const getTutorialWithPopulate = function (id) {
  return modelColle.Tutorial.findById(id).populate("tags");
  // return modelColle.Tutorial.findById(id).populate("tags", "-_id -__v -tutorials");
};
//~~~~~~~~~~~~~~~~~~~~getTagWithPopulate~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const getTagWithPopulate = function (id) {
  return modelColle.Tag.findById(id).populate("tutorials", "-_id -__v -tags");
};





const run = async function () {
  //~~~~~~~~~~~~~~~~~~~~~~~createTutorial~~~~~~~~~~~~~~~~~~~~~~~~~
  var tut1 = await createTutorial({
    title: "Tut #1",
    author: "bezkoder"
  });

  var tut2 = await createTutorial({
    title: "Tut #2",
    author: "zkoder"
  });
  //~~~~~~~~~~~~~~~~~~~~~~~createTag~~~~~~~~~~~~~~~~~~~~~~~~~
  var tagA = await createTag({
    name: "tagA",
  });

  var tagB = await createTag({
    name: "tagB",
  });
  //~~~~~~~~~~~~~~~~~~~~~~~addTagToTutorial~~~~~~~~~~~~~~~~~~~~~~~~~
  // Tut #1: [tagA, tagB]
  var tutorial = await addTagToTutorial(tut1._id, tagA);

  tutorial = await addTagToTutorial(tut1._id, tagB);

  // Tut #2: [tagA]
  tutorial = await addTagToTutorial(tut2._id, tagB);
  //~~~~~~~~~~~~~~~~~~~~~addTutorialToTag~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // tagA: [Tut #1, Tut #2]
  var tag = await addTutorialToTag(tagA._id, tut1);

  tag = await addTutorialToTag(tagA._id, tut2);

  // tagB: [Tut #1]
  tag = await addTutorialToTag(tagB._id, tut1);
  //~~~~~~~~~~~~~~~~~~~~~getTutorialWithPopulate~~~~~~~~~~~~~~~~~~~~~~~~~~~
  tutorial = await getTutorialWithPopulate(tut1._id);
  console.log("\n>> populated tut1:\n", tutorial);
  // >> populated tut1:
  //   {
  //     tags:
  //     [{
  //       tutorials: [Array],
  //       _id: 5db57a03faf1f8434098ab01,
  //       name: 'tagA',
  //       __v: 0
  //     },
  //     {
  //       tutorials: [Array],
  //       _id: 5db57a04faf1f8434098ab02,
  //       name: 'tagB',
  //       __v: 0
  //     }],
  //       _id: 5db579f5faf1f8434098f123,
  //         title: 'Tut #1',
  //           author: 'bezkoder',
  //             __v: 0
  // }
  //~~~~~~~~~~~~~~~~~~~~getTagWithPopulate~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  tag = await getTagWithPopulate(tagB._id);
  console.log("\n>> populated tagB:\n", tag);
  // >> populated tagB:
  //   {
  //     tutorials:
  //     [{ title: 'Tut #1', author: 'bezkoder' },],
  //       _id: 5e417363316cab53182888da,
  //         name: 'tagB',
  //           slug: 'tag-b',
  //             __v: 0
  //   }
};

mongoose
  .connect("mongodb://mean123:<pw>@cluster0-shard-00-00.lrc9z.mongodb.net:27017,cluster0-shard-00-01.lrc9z.mongodb.net:27017,cluster0-shard-00-02.lrc9z.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-wmahz9-shard-0&authSource=admin&retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));

run();
