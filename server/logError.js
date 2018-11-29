logError = function(ex) {
  if (ex.message && ex.name) {
    console.log("caught an exception of type " + ex.name + ": ", ex.message);
  } else {
    console.log("caught a poorly-typed exception: " + ex)
  }
  throw new Meteor.Error(ex.code, ex.name, ex.message);
}
