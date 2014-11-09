var groupModel = require('./models/group'),
    mongoose = require('mongoose'),
    q = require('q');

function Group(){
    //this.allContacts = [];
};

var Groups = groupModel;
var ObjectId = mongoose.Types.ObjectId;

Group.prototype.ifExist = function(name, contacts){
    var def = q.defer();
    Groups.find( { groupName: { $regex: new RegExp("^" + name.toLowerCase(), "i") } }, function(err, group){
        if (err) {
            def.reject(new Error(err));
        } else {
            //console.log(contacts);
            def.resolve({group: group, contacts: contacts});
        }
    });
    return def.promise;
};

Group.prototype.create = function(data){
    var def = q.defer();
    var group = new Groups({
        groupName: data.groupName,
        contacts: data.contacts
    });
    group.save(function (err) {
        if (err) {
            console.log(err);
            def.reject(new Error(err));
        } else {
            def.resolve();
        }
    });
    return def.promise;
};

Group.prototype.updateGroup = function(group, contacts){
    console.log(contacts);
    Groups.findOne({ "_id": new ObjectId(group._id)}, function(err, gr){
        if (err) console.log(err);
        console.log("---");
        console.log(contacts);
        gr.contacts = contacts;
        gr.save();
    });
};

module.exports = Group;