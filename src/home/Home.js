/* global gapi */
import React,{Component} from 'react';
import parse from "html-react-parser";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import WebServiceCard from 'web_services/WebServiceCard';
import RepairCard from '../repair/RepairCard';
import { withCollapsableContainer } from './withCollapsableContainer';
// import OffCanvesOrderStatus from 'components/OffCanvesOrderStatus';

// Main Component for homepage
export default class Home extends Component {
    constructor(){
        super();
        this.state ={
            message:'loading...',
            e110CorollaVideos: null,
            e170CorollaVideos: null,
            fg1CivicVideos: null,
            showPortfolio: false,
            showVideos: false,
            web_service_first_name: '',
            web_service_last_name: '',
            web_service_email: '',
            web_service_phone: '',
            web_service_project_explanation: '',
            web_service_extra_details: '',
            webServiceErrorMessage: null,
            webServiceErrorBool: false,
            webServiceUser: null,
            repair_first_name: '',
            repair_last_name: '',
            repair_email: '',
            repair_phone: '',
            repair_address_line_one: '',
            repair_address_line_two: '',
            repair_address_city: '',
            repair_address_state: '',
            repair_address_postal_code: '',
            repair_address_country: '',
            repair_brand: '',
            repair_model: '',
            repair_serial: '',
            repair_issue: '',
            repairErrorBool: false,
            repairErrorMessage: null,
            repairUser: null
        }
        this.handlePortfolio = this.handlePortfolio.bind(this);
        this.handleVideos = this.handleVideos.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitWebProject = this.submitWebProject.bind(this);
        this.submitRepair = this.submitRepair.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.addClassNameEmbedResponsiveItemToIframes = this.addClassNameEmbedResponsiveItemToIframes.bind(this);
        
        // ComponentWillMount: 
        fetch('http://127.0.0.1:5000/api/home', { method: 'get', mode: 'no-cors', })
        .then( res => res.text())
        .then(res=>this.setState({message:res}))
        .then(this.getVideosFromBackend('e110_corolla_videos', 'e110CorollaVideos'))
        .then(this.getVideosFromBackend('e170_corolla_videos', 'e170CorollaVideos'))
        .then(this.getVideosFromBackend('fg1_civic_videos', 'fg1CivicVideos'))

    }

      //old Corolla Videos = PLq3f8HX2eMEOKTcBfY37BfTixHiLi9K1e

    getVideos(playlistId, localStateVar) {
        /*
        
            This will get videos from Google API
        
        */
        const ytHeaders = {
            'Accept': 'application/json'
        }

        fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&part=player&id=${playlistId}&key=${process.env.REACT_APP_YT_API_KEY}`, {
            method: 'GET',
            headers: ytHeaders,
        })
        .then( res => res.json())
        .then((data) => {
            let varName = `${localStateVar}`;
            console.log(localStateVar)
            this.setState({
                [`${varName}`] : data,
                message: ''
            })
            console.log(this.state.e110CorollaVideos)
        })
    }

    addClassNameEmbedResponsiveItemToIframes() {
        

        if(document.getElementsByTagName("iframe") && this.state.e110CorollaVideos){
            var array = [...document.getElementsByTagName("iframe")]
            array.map((el) => {
                el.classList.add("embed-responsive-item")
            })
        }
    }

    getVideosFromBackend(playlistId, localStateVar) {
        const ytHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'mode': 'no-cors',
        }
        if (!this.state[localStateVar]) {
                fetch(`http://127.0.0.1:5000/api/videos/${playlistId}`, {
                method: 'GET',
                headers: ytHeaders,
            })
            .then( res => res.json())
            .then((data) => {
                let varName = `${localStateVar}`;
                this.setState({
                    [`${varName}`] : data,
                    message: ''
                })
            })
            .then(() => {
                this.addClassNameEmbedResponsiveItemToIframes();
            })
        }
        
    }

    getUserInfo(event){
        console.log(localStorage.getItem('public_id'))
        console.log(localStorage.getItem('token'))
    }

    submitWebProject(event){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'mode': 'no-cors',
        }

        const public_id = localStorage.getItem('public_id');
 
        const submitObject = {
            web_service_first_name: this.state.web_service_first_name,
            web_service_last_name: this.state.web_service_last_name,
            web_service_email: this.state.web_service_email,
            web_service_phone: this.state.web_service_phone,
            web_service_project_explanation: this.state.web_service_project_explanation,
            web_service_extra_details: this.state.web_service_extra_details,
            web_service_user_public_id: public_id
        }
        
        
        fetch(`http://127.0.0.1:5000/api/mail_in_web`, {
            method: 'POST',
            body: JSON.stringify(submitObject),
            headers: headers,
        })
        .then(res=>res.json())
        .catch(err => {
            console.log(err)
            this.setState({
              webServiceErrorMessage: `Error: ${err}`,
              webServiceErrorBool: true,
            });
        });
        
    }

    submitRepair(event){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'mode': 'no-cors',
        }

        const public_id = localStorage.getItem('public_id');

        const submitObject = {
            repair_first_name: this.state.repair_first_name,
            repair_last_name: this.state.repair_last_name,
            repair_email: this.state.repair_email,
            repair_phone: this.state.repair_phone,
            repair_address_line_one: this.state.repair_address_line_one,
            repair_address_line_two: this.state.repair_address_line_two,
            repair_address_city: this.state.repair_address_city,
            repair_address_state: this.state.repair_address_state,
            repair_address_postal_code: this.state.repair_address_postal_code,
            repair_address_country: this.state.repair_address_country,
            repair_brand: this.state.repair_brand,
            repair_model: this.state.repair_model,
            repair_serial: this.state.repair_serial,
            repair_issue: this.state.repair_issue,
            repair_user_public_id: public_id
        }
        
        fetch(`http://127.0.0.1:5000/api/mail_in_repair`, {
            method: 'POST',
            body: JSON.stringify(submitObject),
            headers: headers,
        })
        .then(res=>res.json())
        .catch(err => {
            console.log(err)
            this.setState({
              repairErrorMessage: `Error: ${err}`,
              repairErrorBool: true,
            });
        });
        
    }

    // Handle Show/Hide Events
    handlePortfolio(event){
        this.setState({
            showPortfolio: !this.state.showPortfolio
        })
    }

    handleVideos(event){
        this.setState({
            showVideos: !this.state.showVideos
        })
    }

    handleInputChange =(e)=>{
        const {value,name}= e.target;
        this.setState({
            [name]:value
        });
    }

    componentDidMount(){
        
        //.then(console.log(this.state.e110CorollaVideos))
        // .then(this.getVideos('PLq3f8HX2eMEOKTcBfY37BfTixHiLi9K1e', 'e110CorollaVideos'))
        // .then(this.getVideos('PLq3f8HX2eMEPx3TTxOyJCCwlLRDPL-zTv', 'e170CorollaVideos'))
        // .then(this.getVideos('PLq3f8HX2eMEMzZWjfwIS07nAQMLzrzcpJ', 'fg1CorollaVideos'))
    }

    componentDidUpdate(){
        this.addClassNameEmbedResponsiveItemToIframes();
    }

    render(){
        
        return(
            <Container>
                <Row>
                    <Col lg={1}></Col>
                    <Col lg={10}>
                        <Container>
                            {/* <Row>
                                <Col>
                                <h3>Test</h3>
                                <Button onClick={this.getUserInfo}>Get User Info in Console</Button>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col>
                                    { 
                                        (!this.state.e110CorollaVideos)
                                        ?
                                            <h2 className='text-center'>{this.state.message}</h2>
                                        :
                                            <></>
                                    }
                                </Col>
                            </Row>  
                            <CollapsableVideoList
                                componentTitle="Youtube Videos" 
                                button_text="Show Videos" 
                                id_name="videos" 
                                showContent={this.state.showVideos} 
                                handleShowContent={this.handleVideos}
                                e110CorollaVideos={this.state.e110CorollaVideos} 
                                e170CorollaVideos={this.state.e170CorollaVideos} 
                                fg1CivicVideos={this.state.fg1CivicVideos} 
                                message={this.state.message}>
                            </CollapsableVideoList>   
                            <WebServiceCard 
                                handleInputChange={this.handleInputChange}
                                web_service_first_name={this.state.web_service_first_name}
                                web_service_last_name={this.state.web_service_last_name}
                                web_service_email={this.state.web_service_email}
                                web_service_phone={this.state.web_service_phone}
                                web_service_project_explanation={this.state.web_service_project_explanation}
                                web_service_extra_details={this.state.web_service_extra_details}
                                webServiceErrorMessage={this.state.webServiceErrorMessage}
                                webServiceErrorBool={this.state.webServiceErrorBool}
                                submitWebProject={this.submitWebProject}
                            />
                            <RepairCard 
                                handleInputChange={this.handleInputChange}
                                repair_first_name={this.state.repair_first_name}
                                repair_last_name={this.state.repair_last_name}
                                repair_email={this.state.repair_email}
                                repair_phone={this.state.repair_phone}
                                repair_address_line_one={this.state.repair_address_line_one}
                                repair_address_line_two={this.state.repair_address_line_two}
                                repair_address_city={this.state.repair_address_city}
                                repair_address_state={this.state.repair_address_state}
                                repair_address_postal_code={this.state.repair_address_postal_code}
                                repair_address_country={this.state.repair_address_country}
                                repair_brand={this.state.repair_brand}
                                repair_model={this.state.repair_model}
                                repair_serial={this.state.repair_serial}
                                repair_issue={this.state.repair_issue}
                                repairErrorBool={this.state.repairErrorBool}
                                repairErrorMessage={this.state.repairErrorMessage}
                                submitRepair={this.submitRepair}
                            />
                            <CollapsablePortfolio componentTitle="Portfolio" button_text="Show Portfolio" id_name="portfolio" showContent={this.state.showPortfolio} handleShowContent={this.handlePortfolio}/>
                        </Container>
                    </Col>
                    <Col lg={1}></Col>
                </Row>
            </Container>
        )
    }
}

// Helper Components
const RenderPlaylist = (props) => {
    
    
    return (
        
                (props.videos)
                ?
                    (props.videos.error)
                    ?
                        <Col lg={6}>{props.videos.error.errors[0].message}</Col>
                    :
                        
                        props.videos.items.map((video) => {
                            return (
                                <Col lg={6}>
                                    <h2>{video.snippet.title}</h2>
                                    <div className=''>
                                        <div class="embed-responsive embed-responsive-16by9">
                                            {parse(video.player.embedHtml)}
                                        </div>

                                        
                                    </div>
                                </Col>
                            )
                        })
                            
                :
                    <></>
                        
        
        
    )
}

const Portfolio = (props) => {
    return (
        <>
            <Col lg={4}>
                <Card bg={"light"} text={"dark"} className="my-3">
                    <Card.Header>
                        <h2>Chromebook Parts Inventory and Info Tracker</h2>
                    </Card.Header>
                    <Card.Body>
                        <p>Application that keeps track of Chromebook and Macbook parts with physical location codes to keep track of physical inventory.</p>
                        <Button href="https://chromebooks.v3.jamielynn.dev/" variant="primary">Visit App</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4}>
                <Card bg={"light"} text={"dark"} className="my-3">
                    <Card.Header>
                        <h2>Korean/Japanese Vocab Flashcards</h2>
                    </Card.Header>
                    <Card.Body>
                        <p>Application that quizes on Japanese and Korean flashcards that includes: Topik I, Topik II, and JLPT 5 to 3.</p>
                        <Button href="https://jamielynn.dev/flashcards" variant="primary">Visit App</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4}>
                <Card bg={"light"} text={"dark"} className="my-3">
                    <Card.Header>
                        <h2>Korean/Japanese Grammar and Vocab Points Application</h2>
                    </Card.Header>
                    <Card.Body>
                        <p>Application that allows user to make notes called "points" for Korean and Japanese grammar or vocab.</p>
                        <Button href="https://jamielynn.dev/points" variant="primary">Visit App</Button>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 1
        }}
    />
);



const VideoList = (props) => {
    return (
        <>
            { 
                (!props.e110CorollaVideos)
                ?
                    <h2 className='text-center'>{props.message}</h2>
                :
                <Row>
                    <RenderPlaylist  videos={props.e110CorollaVideos} loading="Loading"/>
                    <RenderPlaylist  videos={props.e170CorollaVideos} loading="Loading"/>
                    <RenderPlaylist  videos={props.fg1CivicVideos} loading="Loading"/>
                </Row>
            }  
        </>
    )
}

// Enhanced Higher Order Components
const CollapsablePortfolio = withCollapsableContainer(Portfolio);
const CollapsableVideoList = withCollapsableContainer(VideoList);
  




