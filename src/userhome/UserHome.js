import React, { useState, useEffect, Component } from "react";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import MailInRepairCards from "repair_admin/MailInRepairCards";
import { withCollapsableContainer } from 'home/withCollapsableContainer';
import RowWithHeading from 'components/RowWithHeading';


class UserHome extends Component {

  constructor(props) {
    super(props);


    this.state = {
      // showModerator: false,
      showAdmin: false,
      currentUser: undefined,
      username: '',
      email: '',
      public_id: '',
      error: null,
      showAdminToast: false,
      generalLedgerLines: null,
      repairsInProgress: null,
      repairsCompleted: null,
      repairErrorMessage: null,
      repairErrorBool: false,
      repairsAll: null,
      showRepairsInProgress: false,
      showRepairsCompleted: false,
      showRepairsAll: false,
      currentDeviceID: 0,
      newLineForLedger: {
        id: null,
        desc: null,
        part_number: null,
        type: null,
        expense: null,
        revenue: null,
        profit: null,
        price: null,
        qty_sold_per_listing: null,
        ebay_order_number: null,
        amazon_order_number: null,
        ebay_fees: null,
        shipping: null,
        taxes: null,
        extra_fees: null,
        part_expenses: null,
        seller: null,
        created_by: null,
        date: null
      }
    }
    this.getUserInfo = this.getUserInfo.bind(this);
    this.showHideAdminToast = this.showHideAdminToast.bind(this);
    this.handleNewLineItemChange = this.handleNewLineItemChange.bind(this);
    this.getGeneralLedgerLines = this.getGeneralLedgerLines.bind(this);
    this.postGeneralLedgerLine = this.postGeneralLedgerLine.bind(this);
    this.getRepairsInProgress = this.getRepairsInProgress.bind(this);
    this.getRepairsCompleted = this.getRepairsCompleted.bind(this);
    this.getRepairsAll = this.getRepairsAll.bind(this);
    this.setRepairComplete = this.setRepairComplete.bind(this);
    this.handleRepairsInProgress = this.handleRepairsInProgress.bind(this);
    this.handleRepairsCompleted = this.handleRepairsCompleted.bind(this);
    this.handleRepairsAll = this.handleRepairsAll.bind(this);
    this.handleCurrentDeviceID = this.handleCurrentDeviceID.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this)

    
  }

  getRepairsInProgress(currentState) {
    // if(currentState.showAdmin){
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'mode': 'no-cors',
      }

      fetch(`http://127.0.0.1:5000/api/mail_in_repair_in_progress`, {
            method: 'GET',
            headers: headers,
        })
        .then(res=>res.json())
        .then((response) => {
          console.log(response);
          this.setState({
            repairsInProgress: response
          });
        })
        .catch(err => {
            console.log(err)
            this.setState({
              repairErrorMessage: `Error: ${err}`,
              repairErrorBool: true,
            });
        });
    // }
  }

  getRepairsCompleted() {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'mode': 'no-cors',
    }

    fetch(`http://127.0.0.1:5000/api/mail_in_repair_completed`, {
          method: 'GET',
          headers: headers,
    })
    .then(res=>res.json())
    .then((response) => {
      console.log(response);
      this.setState({
        repairsCompleted: response
      });
    })
    .catch(err => {
        console.log(err)
        this.setState({
          repairErrorMessage: `Error: ${err}`,
          repairErrorBool: true,
        });
    });
  }

  getRepairsAll() {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'mode': 'no-cors',
    }

    fetch(`http://127.0.0.1:5000/api/mail_in_repair`, {
          method: 'GET',
          headers: headers,
    })
    .then(res=>res.json())
    .then((response) => {
      console.log(Object.keys(response).map((key, index) => {return response[key]}).filter(obj => obj.repair_completed == false))
      this.setState({
        repairsAll: Object.keys(response).map((key, index) => {return response[key]}),
        repairsCompleted: Object.keys(response).map((key, index) => {return response[key]}).filter(obj => obj.repair_completed == true),
        repairsInProgress: Object.keys(response).map((key, index) => {return response[key]}).filter(obj => obj.repair_completed == false)
      });
    })
    .catch(err => {
        console.log(err)
        this.setState({
          repairErrorMessage: `Error: ${err}`,
          repairErrorBool: true,
        });
    });
  }

  setRepairComplete() {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'mode': 'no-cors',
    }

    fetch(`http://127.0.0.1:5000/api/mail_in_repair/${this.state.currentDeviceID}/complete`, {
          method: 'PATCH',
          headers: headers,
    })
    .then(res=>res.json())
    .then((response) => {
      this.setState({
        repairsAll: Object.keys(response).map((key, index) => {return response[key]}),
        repairsCompleted: Object.keys(response).map((key, index) => {return response[key]}).filter(obj => obj.repair_completed == true),
        repairsInProgress: Object.keys(response).map((key, index) => {return response[key]}).filter(obj => obj.repair_completed == false)
      });
    })
    .catch(err => {
        console.log(err)
        this.setState({
          repairErrorMessage: `Error: ${err}`,
          repairErrorBool: true,
        });
    });
  };

  // Called before component mounting
  getUserInfo(personId) {
    fetch(`/api/user/${personId}`,{
        method:'GET',
        'Content-Type':'application/json',
        headers: {'x-access-token': localStorage.getItem('token')}
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        this.setState({
          username : response[personId].username,
          email : response[personId].email,
          public_id : response[personId].public_id,
          showAdmin : response[personId].admin,
          showAdminToast : true
        })
        this.state.username = response[personId].username;
        this.state.email = response[personId].email;
        this.state.public_id = response[personId].public_id;
        this.state.showAdmin = response[personId].admin;
        this.state.showAdminToast = true;
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: error
        });
      });
  }

  showHideAdminToast(event) {
    this.setState({
      showAdminToast: !this.state.showAdminToast
    });
  }

  handleNewLineItemChange = (event, item) => {
    const newLinePromise = new Promise((resolve, reject) => {
      let newState= Object.assign({}, this.state);
      newState.newLineForLedger[item[0]] = event.target.value;
      resolve( 
        newState
      );
    });

    newLinePromise.then((newState) => {
      this.setState(newState);
    });
    // let newState= Object.assign({}, this.state);
    // newState.newLineForLedger[item] = event.target.value;
    // this.setState(newState);
  }

  getGeneralLedgerLines = () => {
    fetch(`/api/general_ledger_all`,{
      method:'GET',
      headers: {'x-access-token': localStorage.getItem('token')}
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      this.setState({
        generalLedgerLines : response
      });
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        error: error
      });
    });
  }

  postGeneralLedgerLine = () => {
    fetch(`/api/general_ledger_one`, {
      method: 'POST',
      body: JSON.stringify(this.state.newLineForLedger),
      headers: {'x-access-token': localStorage.getItem('token')}
    })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      this.setState({
        generalLedgerLines : response
      });
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        error: error
      });
    });
  }

  handleRepairsInProgress(event){
    this.setState({
      showRepairsInProgress: !this.state.showRepairsInProgress
    })
  }
  handleRepairsCompleted(event){
    this.setState({
      showRepairsCompleted: !this.state.showRepairsCompleted
    })
  }
  handleRepairsAll(event){
    this.setState({
      showRepairsAll: !this.state.showRepairsAll
    })
  }

  handleCurrentDeviceID(event){
    this.setState({
      currentDeviceID: event.target.id
    })
  }  

  componentDidMount(){
    this.getUserInfo(this.props.match.params.personId);
    this.getGeneralLedgerLines();
    this.getRepairsAll(this.state);
    
  }

 

  render() {

    return (
      <Container>
        <Row className="my-3">
          <Link to="/">Back to homepage</Link>
        </Row>
        <Row className="my-3">
          <Col>
            <Toast  onClose={this.showHideAdminToast}>
              <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                <strong className="mr-auto">Hello, {this.state.username}!</strong>
                <small>Current User Info</small>
              </Toast.Header>
              <Toast.Body>
                <p>username: {this.state.username}</p>
                <p>email: {this.state.email}</p>
                <p>public_id: {this.state.public_id}</p>
              </Toast.Body>
            </Toast>
          </Col>
          <Col>
            {
              (this.state.showAdmin) 
              
              ? 
                (this.state.showAdminToast) && 
                  <Toast  onClose={this.showHideAdminToast}>
                    <Toast.Header>
                      <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                      <strong className="mr-auto">Admin</strong>
                      <small></small>
                    </Toast.Header>
                    <Toast.Body>Hello, {this.state.username}. You're an admin!</Toast.Body>
                  </Toast>
                
                
              :
                <p>Big ones</p>
            }
          </Col>
        </Row>
        <CollapsableMailInRepairCardsInProgress
          componentTitle="Repairs In Progress"
          button_text="Show Repairs In Progress"
          id_name="repairs_in_progress" 
          showContent={this.state.showRepairsInProgress} 
          handleShowContent={this.handleRepairsInProgress}
          repairList={this.state.repairsInProgress}
          setRepairComplete={this.setRepairComplete}
          handleCurrentDeviceID={this.handleCurrentDeviceID}
          currentDeviceID={this.state.currentDeviceID}
          getRepairsAll={this.getRepairsAll}
        />
        <CollapsableMailInRepairCardsCompleted
          componentTitle="Repairs Completed"
          button_text="Show Repairs Completed"
          id_name="repairs_completed" 
          showContent={this.state.showRepairsCompleted} 
          handleShowContent={this.handleRepairsCompleted}
          repairList={this.state.repairsCompleted}
          setRepairComplete={this.setRepairComplete}
          handleCurrentDeviceID={this.handleCurrentDeviceID}
          currentDeviceID={this.state.currentDeviceID}
          getRepairsAll={this.getRepairsAll}
        />
        <CollapsableMailInRepairCardsAll
          componentTitle="All Repairs"
          button_text="Show All Repairs"
          id_name="repairs_all" 
          showContent={this.state.showRepairsAll} 
          handleShowContent={this.handleRepairsAll}
          repairList={this.state.repairsAll}
          setRepairComplete={this.setRepairComplete}
          handleCurrentDeviceID={this.handleCurrentDeviceID}
          currentDeviceID={this.state.currentDeviceID}
          getRepairsAll={this.getRepairsAll}
        />
        <Row>
          <Col xs={12}>
            <hr className="my-4">
            </hr>
          </Col>
          <Col xs={12}>
            <h2 className="w-100 text-center">
              New Line in General Ledger
            </h2>
          </Col>
          <Col xs={12}>
            <hr className="my-4">
            </hr>
          </Col>
        </Row>
        <Form className="w-100 row">
            
            {
              Object.entries(this.state.newLineForLedger).slice(1).map((col) => {
                return (
                  <Col className="col-sm-6 col-lg-4">
                    <Form.Group xs={12} controlId={col + ".control"}>
                      <Form.Label>{col[0]}</Form.Label>
                      <Form.Control
                        type="text"
                        aria-describedby={col + "aria"}
                        name={col} 
                        className="mb-3" 
                        onChange={ (e) => this.handleNewLineItemChange(e, col)}
                      />
                      {/* <Form.Text id={col + "error_message"} muted>
                        { `Value is required for ${col}.`}
                      </Form.Text> */}
                    </Form.Group>
                  </Col>
                  
                );
              })
            }
          <Button onClick={this.postGeneralLedgerLine}>Add New Line</Button>
        </Form>
        <Row>
          <Col xs={12}>
            <hr className="my-4">
            </hr>
          </Col>
          <Col xs={12}>
            <h2 className="w-100 text-center">
              Current General Ledger
            </h2>
          </Col>
          <Col xs={12}>
            <hr className="my-4">
            </hr>
          </Col>
        </Row>
        <Row>
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                {/* {
                  (this.state.generalLedgerLines) 
                  
                  ? 
                    Object.keys(this.state.generalLedgerLines["1"]).map((col) => {
                      return (<th>{col}</th>);
                    })
                  :
                    Object.keys(this.state.newLineForLedger).map((col) => {
                      return (<th>{col}</th>);
                    })
                    
                } */}
                {
                  Object.keys(this.state.newLineForLedger).map((col) => {
                    return (<th>{col}</th>);
                  })
                }
              </tr>
            </thead>
            <tbody>
              {/* <tr>
                <td><Button>Add New Line</Button></td>
                {
                  Object.entries(this.state.newLineForLedger).slice(1).map((col) => {
                    return (
                      <td>
                        <InputGroup name={col} className="mb-3" onChange={ (e) => this.handleNewLineItemChange(e, col)}>
                          
                          <FormControl
                            placeholder={col[0]}
                            aria-label={col[0]}
                            aria-describedby="basic-addon1"
                          />
                        </InputGroup>
                      </td>
                    );
                  })

                }
                
              </tr> */}
              {
                  (this.state.generalLedgerLines) 
                  
                  ? 
                    Object.keys(this.state.generalLedgerLines).map((rowKey, index) => {
                      let rowValue = this.state.generalLedgerLines[rowKey]
                      console.log(rowValue)

                      return (
                        <tr>
                          <td>{rowKey}</td>
                          {
                            Object.values(this.state.generalLedgerLines[rowKey]).map((col) => {
                              return (<td>{col}</td>);
                            })
                          }
                        </tr>
                      );
                    })
                  :
                    Object.keys(this.state.newLineForLedger).map((col) => {
                      return (<th></th>);
                    })
                    
                }
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

// Enhanced Higher Order Components
const CollapsableMailInRepairCardsInProgress = withCollapsableContainer(MailInRepairCards);
const CollapsableMailInRepairCardsCompleted = withCollapsableContainer(MailInRepairCards);
const CollapsableMailInRepairCardsAll = withCollapsableContainer(MailInRepairCards);


export default UserHome;
