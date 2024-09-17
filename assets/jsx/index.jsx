import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import {t} from 'ttag';

import SearchProvider from 'p2pu-components/dist/Search/SearchProvider';
import LearningCircleSignup from 'p2pu-components/dist/LearningCircleSignup/LearningCircleSignup';
import SearchBar from 'p2pu-components/dist/Search/SearchBar';
import SearchTags from 'p2pu-components/dist/Search/SearchTags';
import BrowseLearningCircles from 'p2pu-components/dist/LearningCircles/Browse';

//import "p2pu-components/dist/build.css"

const NoNoResultsComponent = props => <></>

const CustomSearch = (props) => {
  return (
    <>
      <BrowseLearningCircles
        {...props}
        NoResultsComponent={NoNoResultsComponent}
      />
    </>
  );
}

class App extends React.Component {

  constructor(props){
    super(props);
    this.handleLearningCircleSelection = this.handleLearningCircleSelection.bind(this);
    this.handleSignupDialogClose = this.handleSignupDialogClose.bind(this);
    this.state = {
      selectedLearningCircle: null,
    };
  }

  handleLearningCircleSelection(learningCircle) {
    console.log(`Clicked on ${learningCircle.url}`);
    this.setState({...this.state, selectedLearningCircle: learningCircle});
  }

  handleSignupDialogClose(learningCircle){
    this.setState({...this.state, selectedLearningCircle: null});
  }

  render() {
    return (
      <div>
        {
          this.state.selectedLearningCircle &&
            <LearningCircleSignup
              onCancel={this.handleSignupDialogClose}
              learningCircle={this.state.selectedLearningCircle}
              signUpUrl='https://learningcircles.p2pu.org/api/signup/'
            /> 
        }
        <div className={this.state.selectedLearningCircle?'d-none':''}>
          <SearchProvider
            origin="https://learningcircles.p2pu.org"
            initialState={{team_id: 46}}
            searchSubject={'learningCircles'}
            locale="en"
            defaultImageUrl="/assets/img/p2pu-ogimg-default.jpg"
            //onSelectResult={this.handleLearningCircleSelection}
          >
            <CustomSearch />
          </SearchProvider>
        </div>
      </div>
    );
  }
};

const lcRoot = createRoot(document.getElementById("learning-circle-search"))
lcRoot.render(<App />)


const FacilitatorCard = ({image, name, bio})  => {
  return (
    <div className="facilitator-card col-8 offset-2 col-lg-4 offset-lg-4">
      <img className="rounded-circle" width="200" height="200" src={image}/>
      <div className="profile">
        <h2>{name}</h2>
        <p>{bio}</p>
      </div>
    </div>
  )
}

const Facilitators = (props) => {

  // `${API_ORIGIN}/api/teams/${TEAM_ID}/`
  const [facilitators, setFacilitators] = useState([])
  useEffect(() => {
    fetch(`${props.API_ORIGIN}/api/teams/${props.teamId}/`).then(resp => {
      // TODO errors and stuff
      return resp.json();
    }).then(data => {
      setFacilitators(data.item.facilitators);
    })
  }, [])

  return (
    <div id="carouselExampleFade" class="carousel carousel-dark slide">
      <div class="carousel-inner">
        { 
          facilitators.map((fa, idx) =>
            <div class={"carousel-item" + (idx==0?" active":"")} >
              <FacilitatorCard 
                image={ fa.avatar_url?fa.avatar_url:"https://learningcircles.p2pu.org/static/images/avatars/p2pu_avatar_blue.png" }
                name={fa.first_name}
                bio={fa.bio}
              />
            </div>
          )
        }
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  )
}

const facilitatorsRoot = createRoot(document.getElementById("team-facilitators"))
facilitatorsRoot.render(
  <Facilitators 
    API_ORIGIN='https://learningcircles.p2pu.org'
    teamId='46'
  />
)
