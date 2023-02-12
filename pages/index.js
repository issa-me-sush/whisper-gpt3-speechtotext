// import React, { useState, useEffect,useRef } from "react";
// import { useToast, Box, Button, Text, Spinner, Stack, Link } from "@chakra-ui/react";
// import axios from "axios";
// import TextEncoder from "text-encoding";
// import { Icon } from "@chakra-ui/react";

// const StopIcon = () => <Icon name="stop" size="24px" />;
// const RecordIcon = () => <Icon name="record" size="24px" />;

// const Index = () => {
//   const [audioFile, setAudioFile] = useState(null);
//   const [transcription, setTranscription] = useState(null);
//   const [summary, setSummary] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [recordOption, setRecordOption] = useState("microphone");
//   const toast = useToast();

//   useEffect(() => {
//     navigator.getUserMedia = (navigator.getUserMedia ||
//       navigator.webkitGetUserMedia ||
//       navigator.mozGetUserMedia ||
//       navigator.msGetUserMedia);
//   }, []);

//   const mediaRecorderRef = useRef();

//   const startRecording = () => {
//     setRecording(true);
//     navigator.getUserMedia({ audio: true }, function (stream) {
//       let chunks = [];

//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       mediaRecorder.start();

//       mediaRecorder.ondataavailable = function (e) {
//         chunks.push(e.data);
//       };

//       mediaRecorder.onstop = function (e) {
//         const audioBlob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
//         chunks = [];
//         setAudioFile(audioBlob);
//         setRecording(false);
//       };
//     }, function (err) {
//       console.error(err);
//     });
//   };

//   const stopRecording = () => {
//     setRecording(false);
//     mediaRecorderRef.current.stop();
//   };
  
//   const handleFileChange = (e) => {
//     setAudioFile(e.target.files[0]);
//     setRecordOption("file");
//   };

//   const handleTranscription = async () => {
//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append("audio", audioFile);

//     try {
//       const res = await axios.post(
//         "https://api.openai.com/v1/engines/whisper/jobs",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//           }
//         }
//       );

//       const jobId = res.data.id;
//       const jobRes = await axios.get(
//         `https://api.openai.com/v1/engines/whisper/jobs/${jobId}`,
//         {
//           headers: {
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//           }
//         }
//       );

//       if (jobRes.data.status === "completed") {
//         const textEncoder = new TextEncoder();
//         const responseText = textEncoder.decode(new Uint8Array(jobRes.data.result.text.data));
//         setTranscription(responseText);
//         } else {
//         throw new Error("Job failed to complete.");
//         }
//         } catch (error) {
//         toast({
//         title: "Error",
//         description: error.message,
//         status: "error",
//         duration: 9000,
//         isClosable: true,
//         });
//         } finally {
//         setIsLoading(false);
//         }
//         };
        
//         return (
//         <Box padding={8}>
//         <Stack>
//         {recording ? (
//         <Button onClick={stopRecording}>Stop Recording</Button>
//       ) : (
//         <Button onClick={startRecording}>Start Recording</Button>
//       )}
//         <Button onClick={handleFileChange}>Choose File</Button>
//         <Button onClick={handleTranscription} disabled={!audioFile}>
//         Get Transcription
//         </Button>
//         {isLoading &&
//         <Spinner size="sm" />}
// </Stack>
// {transcription ? (
// <Text margin={2}>
// Transcription:{" "}
// <Link
// href={`data:text/plain;charset=utf-8,${encodeURIComponent(transcription)}`}
// download="transcription.txt"
// >
// Download
// </Link>
// </Text>
// ) : (
// <Text margin={2}>No transcription available</Text>
// )}
// </Box>
// );
// };

// export default Index;

import React, { useState, useRef,useEffect } from "react";
import { Button, Input, Typography, Row, Col, Card } from 'antd';


const MyApp = () => {
  const { TextArea } = Input;
const { Title } = Typography;
  const [recording, setRecording] = useState(false);
  const [recordedData, setRecordedData] = useState(null);
  const [processedText, setProcessedText] = useState(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({ text: "" });
  const [edit, setEdit] = useState(false);
const [text, setText] = useState("");
const toggleEdit = () => {
  setEdit(!edit);
};

const saveChanges = () => {
  setSummary({ text });
  setEdit(false);
};
  const startRecording = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
      const chunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });
      mediaRecorderRef.current.addEventListener("stop", () => {
        const recordedBlob = new Blob(chunks, { type: "audio/x-flac" });

        setRecordedData(URL.createObjectURL(recordedBlob));
      });
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  
    // setTimeout(async () => {
    //   const file = await fetch("/test2.flac");
    //   const fileBlob = await file.blob();
  
    //   const fileBlobActive = recordedData ? await recordedData.blob() : null;
    //   if (fileBlobActive) {
    //     try {
    //       const resultResponse = await fetch(
    //         "https://api-inference.huggingface.co/models/openai/whisper-large-v2",
    //         {
    //           headers: { Authorization: "Bearer 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" },
    //           method: "POST",
    //           body: fileBlobActive,
    //         }
    //       );
    //       const result = await resultResponse.json();
    //       setProcessedText(JSON.stringify(result));
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   } else {
    //     console.log("recordedData is null");
    //   }
    // }, 6000); // give a delay of 500 milliseconds
  };
  
  useEffect(() => {
    console.log("in the useEffect")
    if (!recordedData) {
      console.log("yoyo still null");
    }

    (async () => {
      try {
        const recordedBlob =  await fetch(recordedData);
        const fileBlob = await recordedBlob.blob();
        const resultResponse = await fetch(
          "https://api-inference.huggingface.co/models/openai/whisper-large-v2",
          {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: fileBlob,
          }
        );
        const result = await resultResponse.json();
        if(result.text){
        setProcessedText(JSON.stringify(result.text));}
      } catch (error) {
        console.error(error);
      }
    })();
  }, [recordedData]);

  
  useEffect(() => {
    const fetchData = async () => {
      if (processedText) {
        setIsLoading(true);
        const res = await fetch(`/api/openai`, {
          body: JSON.stringify({
            name: `summarize this : ${processedText}`,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const sum = await res.json();
        setSummary(sum);
        setText(sum.text);
        console.log("summarized version:" + JSON.stringify(sum) )
        setIsLoading(false);
      }
    };

    fetchData();
  }, [processedText]);



  return (
    // <div style={{ 
    //   padding: "40px", 
    //   background: "linear-gradient(to right, #3f51b5, #5c6bc0, #7986cb, #9fa8d4, #c5cae9)", 
    //   height: "100vh", 
    //   display: "flex", 
    //   flexDirection: "column", 
    //   alignItems: "center", 
    //   justifyContent: "center" 
    // }}>
    //   <button style={{ 
    //     backgroundColor: "#2196f3", 
    //     color: "white", 
    //     padding: "10px 20px",
    //     borderRadius: "25px",
    //     marginBottom: "20px"
    //   }} onClick={startRecording} disabled={recording}>
    //     Start Recording
    //   </button>
    //   <button style={{ 
    //     backgroundColor: "#f44336", 
    //     color: "white", 
    //     padding: "10px 20px", 
    //     marginLeft: "10px", 
    //     borderRadius: "25px",
    //     marginBottom: "20px"
    //   }} onClick={stopRecording} disabled={!recording}>
    //     Stop Recording
    //   </button>
    //   {recordedData && <audio style={{ marginTop: "20px" }} controls src={recordedData} />}
    //   {processedText && 
    //     <p style={{ 
    //       marginTop: "20px", 
    //       color: "black", 
    //       fontSize: "20px" 
    //     }}>
    //       Processed Text: {processedText}

    //     </p>
    //   }
    //    {isLoading ? <div>Loading ...</div> : <span> Summarized Text: {summary.text} </span>}
    // </div>
    <div style={{ 
      padding: "40px", 
      background: "linear-gradient(to right, #3f51b5, #5c6bc0, #7986cb, #9fa8d4, #c5cae9)", 
      height: "130vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
 <Card
  style={{
    width: '20%',
    height: '100px',
    margin: '0% 10% 5% 10%',
    backgroundImage: `url(${'logo.jpg'})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    "@media (max-width: 576px)": {
      height: '15px',
    },
    "@media (max-width: 375px)": {
      height: '10px',
    }
  }}
/>








      <Row gutter={16}>
        <Col span={12}>
          <Button
            style={{ 
              background: "linear-gradient(to right, #2196f3, #64b5f6)", 
              color: "white", 
              padding: "10px 20px",
              borderRadius: "25px",
              marginBottom: "20px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display:"flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onClick={startRecording}
            disabled={recording}
          >
            {recording ? "Recording..." : "Start Recording"}
          </Button>
        </Col>
        <Col span={12}>
          <Button
            style={{ 
              background: "linear-gradient(to right, #f44336, #e57373)", 
              color: "white", 
              padding: "10px 20px", 
              marginLeft: "10px", 
              borderRadius: "25px",
              marginBottom: "20px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display:"flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onClick={stopRecording}
            disabled={!recording}
          >
            Stop Recording
          </Button>
        </Col>
      </Row>

      {recordedData && (
        <Card style={{ marginTop: "20px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
          <audio controls src={recordedData} />
        </Card>
      )}
      {processedText && (
        <Card style={{ marginTop: "20px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",width: '76%', maxWidth: '100%'  }}>
          <Title level={4} style={{ color: "black" }}>Processed Text:</Title>
          <TextArea value={processedText} rows={4} cols={16} readOnly />
        </Card>
      )}
      {isLoading ? (
    <div>Loading ...</div>
  ) : (
    <Card style={{ marginTop: "20px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",width: '76%', maxWidth: '100%' }}>
      <Title level={4} style={{ color: "black" }}>Summarized Text:</Title>
      <TextArea value={summary.text} rows={4} cols={16}/>
    </Card>
  )}
      {isLoading ? (
    <div>Loading ...</div>
  ) : (
    <Card style={{ marginTop: "20px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",width: '76%', maxWidth: '100%'  }}>
      <Title level={4} style={{ color: "black" }}>Final submission</Title>
      {edit ? (
        <>
          <TextArea value={text} onChange={e => setText(e.target.value)} rows={4}  cols={16}/>
          <Button style={{ marginTop: "10px" }} onClick={saveChanges}>
            Save
          </Button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: "0" }}>{summary.text}</p>
          <Button style={{ marginTop: "10px" }} onClick={toggleEdit}>
            Edit
          </Button>
        </>
      )}
    </Card>
  )}
    </div>
    
  );
};

export default MyApp;



// import 'regenerator-runtime/runtime';
// import React from "react";
// import SpeechRecognition, {
//   useSpeechRecognition
// } from "react-speech-recognition";

// const MyApp = () => {
//   const { transcript, resetTranscript } = useSpeechRecognition({
//     continuous: true
//   });

//   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//     return null;
//   }

//   return (

//     <div>
//       <button onClick={SpeechRecognition.startListening}>Start</button>
//       <button onClick={SpeechRecognition.stopListening}>Stop</button>
//       <button onClick={resetTranscript}>Reset</button>
//       <p>{transcript}</p>
//     </div>
//   );
// };

// export default MyApp;
