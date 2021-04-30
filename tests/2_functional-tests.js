const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let project_name = 'testing'

//required fields
let issue_title = 'Tester'
let issue_text = 'Text for testing purposes'
let created_by = 'TestMochaChai'

//optional fields
let assigned_to = 'JSPython'
let status_text = 'Testing in QA'
var _id;
suite('Functional Tests', function() {

    suite('POST Tests', () => {

        test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
            chai.request(server)
                .post('/api/issues/' + project_name)
                .send({issue_text, issue_title, created_by, assigned_to, status_text})
                .end((err, res) => {
                    assert.equal(res.body.issue_title, issue_title)
                    assert.equal(res.body.issue_text, issue_text)
                    assert.equal(res.body.created_by, created_by)
                    assert.equal(res.body.assigned_to, assigned_to)
                    assert.equal(res.body.status_text, status_text)
                    _id = res.body._id
                    done()
                })
        })

        test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
            chai.request(server)
                .post('/api/issues/' + project_name)
                .send({issue_text, issue_title, created_by})
                .end((err, res) => {
                    assert.equal(res.body.issue_title, issue_title)
                    assert.equal(res.body.issue_text, issue_text)
                    assert.equal(res.body.created_by, created_by)
                    done()

                })
        })

        test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
            chai.request(server)
                .post('/api/issues/' + project_name)
                .send({issue_text, created_by})
                .end((err, res) => {
                    assert.equal(res.body.error, "required field(s) missing")
                    done()
                })
        })

    })

    suite('GET Tests', () => {
        test('View issues on a project: GET request to /api/issues/{project}', (done) => {
            chai.request(server)
                .get('/api/issues/' + project_name)
                .end((err, res) => {
                    assert.isArray(res.body, issue_title)
                    done()
                })
        })

        test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
            chai.request(server)
                .get('/api/issues/' + project_name +'?' + 'open=false')
                .end((err, res) => {
                    assert.isArray(res.body, issue_title)
                    res.body.forEach(element => {
                        assert.equal(element.open, false)
                    });
                    done()
                })
        })

        test('View issues on a project with multiple filter: GET request to /api/issues/{project}', (done) => {
            chai.request(server)
                .get('/api/issues/' + project_name +'?' + 'open=false' + '&' + 'created_by=getman')
                .end((err, res) => {
                    assert.isArray(res.body, issue_title)
                    res.body.forEach(element => {
                        assert.equal(element.open, false)
                        assert.equal(element.created_by, 'getman' )
                    });
                    done()
                })
        })
        
    })

    suite('PUT Tests', () => {

        test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
            chai.request(server)
                .put('/api/issues/' + project_name)
                .send({_id, created_by: 'mocha chai tester'})
                .end((err, res) => {
                    assert.equal(res.body._id, _id)
                    assert.equal(res.body.result, "successfully updated")
                    done()
                })
        })

        test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
            chai.request(server)
                .put('/api/issues/' + project_name)
                .send({_id, created_by: 'mocha chai tester', issue_text: 'another update for this purpose'})
                .end((err, res) => {
                    assert.equal(res.body._id, _id)
                    assert.equal(res.body.result, "successfully updated")
                    done()
                })
        })

        test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
            chai.request(server)
                .put('/api/issues/' + project_name)
                .send({ created_by: 'mocha chai tester', issue_text: 'another update for this purpose'})
                .end((err, res) => {
                    assert.equal(res.body.error, "missing _id")
                    done()
                })
        })

        test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
            chai.request(server)
                .put('/api/issues/' + project_name)
                .send({ _id})
                .end((err, res) => {
                    assert.equal(res.body.error, "no update field(s) sent")
                    assert.equal(res.body._id, _id)
                    done()
                })
        })

        test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
            chai.request(server)
                .put('/api/issues/' + project_name)
                .send({ _id: '608baa9e22fb9e1240002f37',  created_by: 'mocha chai tester'})
                .end((err, res) => {
                    assert.equal(res.body.error, "could not update")
                    assert.equal(res.body._id, '608baa9e22fb9e1240002f37')
                    done()
                })
        })

        
    })

    suite('DELETE Tests', () => {

        test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
            chai.request(server)
                .delete('/api/issues/' + project_name)
                .send({ _id: _id})
                .end((err, res) => {
                    assert.equal(res.body.result,'successfully deleted')
                    assert.equal(res.body._id, _id )
                    done()
                })
        })

        test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
            chai.request(server)
                .delete('/api/issues/' + project_name)
                .send({ _id: '608baa9e22fb9e1240002f37'})
                .end((err, res) => {
                    assert.equal(res.body.error,'could not delete')
                    assert.equal(res.body._id, '608baa9e22fb9e1240002f37')
                    done()
                })
        })

        test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
            chai.request(server)
                .delete('/api/issues/' + project_name)
                .send({})
                .end((err, res) => {
                    assert.equal(res.body.error,'missing _id')
                    done()
                })
        })


        
    })
  
});
