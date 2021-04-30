'use strict';

require('dotenv').config()
let mongoose = require("mongoose");
mongoose.pluralize(null);
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});
const issueSchema = new mongoose.Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: {type: String, default: ''},
  status_text: {type: String, default: ''},
  open : {type: Boolean, default: true}
}, {timestamps: {createdAt: 'created_on', updatedAt: 'updated_on'}})

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema)
      //here it is assumed that only the right parameters are being sent. OTherwise it will return an empty result. Duty of FCC frontend to ensure the requests sent are valid. invalid key params are not being sent.
      Issue.find(req.query,  (err, data) => {
        if (err) console.error(err)
        return res.send(data)
      })
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema)
      let {issue_title, issue_text, created_by} = req.body
      if (!issue_title || !issue_text || !created_by){
        return res.send({"error": "required field(s) missing"})
      }
      var issue = new Issue(req.body)
      issue.save((err, data) => {
        if (err) console.error(err)
        return res.send(data)
      })
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema)
      let _id = req.body._id
      if (!_id){
        return res.json({"error": "missing _id"})
      }
      let fields = Object.keys(req.body).length
      if (fields == 1){
        return res.json({ error: 'no update field(s) sent',  _id })
      }

      Issue.findByIdAndUpdate(_id, req.body, {new: true}, (err, data) => {
        if (!data) {
          return res.json({ error: 'could not update', _id })
        }
        return res.json({result: 'successfully updated', _id})
      })
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema)
      let _id = req.body._id
      if (!_id){
        return res.json({"error": "missing _id"})
      }

      Issue.findByIdAndDelete(_id, (err, data) => {
        if (err) console.error(err)
        if (!data) return res.send({ error: 'could not delete', _id })
        return res.send({ result: 'successfully deleted',  _id })
      })
    });
    
};
