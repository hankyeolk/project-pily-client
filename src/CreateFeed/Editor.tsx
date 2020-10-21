import React, {Component, useState } from "react";
import ReactQuill from './CreateFeed_Config';
import axios from "axios";
import "quill/dist/quill.snow.css";
import "./EditorStyle.css";

type appProps = {
  changeFeedContent: (e:string) => void;
};

type appState = {
  text : string;
}

class Editor extends Component <appProps, appState> {
  constructor(props:appProps) {
    super(props);
    this.state = {
      text : ""
    };
  }

  modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ size: ['small', false, 'large', 'huge'] }], 
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'align': []},{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
    imageUploader: {
      upload: async (file:File) => {
        const bodyFormData = new FormData();
        bodyFormData.append("img", file);
        const response = await axios({
          method: "post",
          url:
            "http://localhost:4000/upload",
          data: bodyFormData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        return response.data[0].location;
      }
    },
    imageResize: {
      handleStyles: {
        backgroundColor: 'black',
        border: 'none',
        color: 'white',
      },
      modules: ['Resize', 'DisplaySize', 'Toolbar'],
    },
    imageDrop: true
  };

  formats = [
      'header', 'size', 'font',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image','align',
  ];
  
  componentDidUpdate(prevProps:any, prevState:Readonly<appState>){
    if(this.state.text !== prevState.text){
      this.props.changeFeedContent(this.state.text);
    }
  }


  render() {
    
    return (
      <ReactQuill
        theme="snow"
        modules={this.modules}
        formats={this.formats}
        value={this.state.text}
        onChange={content => {
          this.setState({ text: content });
        }}
        placeholder="any"
      />
    );
  }
}
export default Editor;