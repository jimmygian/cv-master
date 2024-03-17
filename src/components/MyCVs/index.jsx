import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../utils/GlobalContext";
import { Navigate, useNavigate } from "react-router-dom";
import "./myCVs.css";
import Accordion from "react-bootstrap/Accordion";
import ReactMarkdown from "react-markdown";
import { getUserCVs } from "../../config/firestore";
import { useAuth } from "../../utils/contexts/authContext";

export default function MyCVs() {
  const { userLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();
  const { handleCV } = useGlobalContext();
  const [currentSelection, setCurrentSelection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [CVs, setCVs] = useState([]);

  // FETCH COMPONENT DATA
  useEffect(() => {
    const fetchCVs = async () => {
      if (!currentUser) return; // Stop fetch if not logged in
      setIsLoading(true);
      try {
        const CVs = await getUserCVs(currentUser.uid);
        // console.log(CVs);
        setCVs(CVs);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCVs();
  }, [currentUser]);

  function goToEditor() {
    navigate("/editor");
  }

  const userCVEls = CVs.map((CV, index) => {
    const CVtitle = CV.CVTitle;
    const lastModified = CV.lastModified;

    const data = CV;
    const title = data.title;
    const summary = data.summary;
    const skillsHeader = data.skills.header;
    const skillsArr = data.skills.skills;
    const expHeader = data.experience.header;
    const expArr = data.experience.experience;
    const eduHeader = data.education.header;
    const eduArr = data.education.education;
    const other = data.other;

    function getIndex(e, index) {
      setCurrentSelection(index);
    }

    function checkLastDigit(index) {
      // Get the last digit of the index
      const lastDigit = index % 10;

      // Check if the last digit is one of the specified values
      if (
        lastDigit === 1 ||
        lastDigit === 3 ||
        lastDigit === 5 ||
        lastDigit === 7 ||
        lastDigit === 9
      ) {
        return "lighter";
      } else {
        return "";
      }
    }

    function handleArr(header, bodyArr) {
      let combined = `${header}\n`;
      for (const body of bodyArr) {
        combined += body;
        combined += `\n`;
      }
      return combined;
    }

    const skills = handleArr(skillsHeader, skillsArr);
    const exp = handleArr(expHeader, expArr);
    const edu = handleArr(eduHeader, eduArr);

    const combinedText = `${title}
${summary}

${skills}

${exp}

${edu}

${other}
`;

    return (
      <div
        className="cv-item"
        key={`CVitemKey-${index}`}
        id={`${index}`}
        onClick={(e) => getIndex(e, index)}
      >
        <Accordion.Item eventKey={`CVitem-${index}`}>
          <Accordion.Header className={checkLastDigit(index)}>{`CV${
            index + 1
          } --  ${CVtitle}`}</Accordion.Header>
          <Accordion.Body>
            <ReactMarkdown className="previewCV">{combinedText}</ReactMarkdown>
          </Accordion.Body>
        </Accordion.Item>
      </div>
    );
  });

  return (
    <div className="myCVsWrapper">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {CVs.length > 0 ? (
            <div>
              <div className="CVTools container-fluid">
                <button
                  onClick={() => handleCV(currentSelection, "modify")}
                  className="btn col tool modifyBtn"
                >
                  Modify
                </button>
                <button
                  onClick={() => handleCV(currentSelection, "duplicate")}
                  className="btn col tool duplicateBtn"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => handleCV(currentSelection, "remove")}
                  className="btn col tool removeBtn"
                >
                  Remove
                </button>
              </div>
              <h3>
                <div className="container-fluid myCVsWrapper-grid">
                  <Accordion defaultActiveKey="0">{userCVEls}</Accordion>
                </div>
              </h3>
            </div>
          ) : (
            <div className="noCVs container-fluid d-flex flex-column justify-content-center align-items-center">
              <h3 className="CVcound">Let's create your first CV!</h3>
              <button onClick={goToEditor} className=" btn welcomeBtn">
                Create CV
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
