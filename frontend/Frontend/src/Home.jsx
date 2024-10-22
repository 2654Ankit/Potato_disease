import "./App.css"
import "axios"
// import dotenv from 'dotenv'
import axios from "axios";
import React, { useState, useRef, useEffect } from "react"
const viteURL = import.meta.env.VITE_API_KEY


const Home = () => {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState()
    const [data, setData] = useState();
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)
    const [confidence, setConfidence] = useState()
    const [predicted, setPrediction] = useState(false)
    const [clear, setClear] = useState(false)


    const SendFile = async () => {
        if (images.length !== 0) {

            let formData = new FormData();

            formData.append("file", selectedFile);

            console.log(formData);

            let res = await axios({
                method: "post",
                url: viteURL,
                data: formData
            });

            console.log("res is", res.data);

            if (res.status === 200) {

                setConfidence(res.data['confidence'])
                setData(res.data['class']);
                setPrediction(true)


            } else {
                console.log("else");

            }
            setLoading(false)

        } else {
            console.log("please select image");

        }
    }






    function selectFiles() {
        fileInputRef.current.click()
    }
    function deleteImage(index) {
        setImages((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        )
    }
    function onFileSelect(event) {
        const files = event.target.files;
        console.log("files", files);

        if (files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            setSelectedFile(files[0])
            if (files[i].type.split("/")[0] !== 'image') continue;
            if (!images.some((e) => e.name === files[i].name)) {
                setImages((prevImages) => [
                    ...prevImages,
                    {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i])
                    },
                ]);
            }
        }



    }

    function onDragOver(event) {
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect = "copy";
    }

    function onDragLeave(event) {
        event.preventDefault();
        setIsDragging(false);
    }

    function onDrop(event) {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files

        setImages((prevImages) => [
            ...prevImages,
            {
                name: files[0].name,
                url: URL.createObjectURL(files[0])
            },
        ]);

        setSelectedFile(files[0])



    }

    function uploadImage() {
        setLoading(true)
        SendFile()

    }




    return (
        <body>


            {predicted ? (
                <div class="card" style={{ "width": " 18rem" }}>
                    {images.map((images, index) => (
                        <div>

                            <img src={images.url} class="card-img-top" alt="..." />
                            <div class="card-body">

                                <table class="table">

                                    <tbody>
                                        <tr>

                                            <td><b>Label</b></td>
                                            <td>{data}</td>

                                        </tr>
                                        <tr>

                                            <td><b>Confidence</b></td>
                                            <td>{confidence}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <button type="button" class="btn btn-outline-primary" onClick={() => {
                                setPrediction(false)
                                deleteImage(index)
                            }}>Clear</button>
                        </div>
                    ))
                    }

                </div>


            ) : (

                <div className="background_">
                    <div className="container_">
                        <div className="card_">
                            <div className="top_">
                                <p>Potato disease predictor</p>
                            </div>
                            <div className="drag-area_ select_" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} role="button" onClick={selectFiles}>
                                {isDragging ? (
                                    <span className="select_"  >
                                        Drop image here

                                    </span>

                                ) : (
                                    <>

                                        <span className="select_"  >

                                            Drag and drop leaf image here or
                                            Browse


                                        </span>



                                    </>

                                )

                                }
                                <input type="file" name="file" className="file_" multiple ref={fileInputRef} onChange={onFileSelect} />
                            </div>

                            <div className="sub-container_ ">
                                {images.map((images, index) => (
                                    <>

                                        <div className="image_" key={index}>
                                            <span className="delete_" onClick={() => deleteImage(index)}>
                                                &#215;
                                            </span>
                                            <img src={images.url} alt={images.name} />
                                        </div>


                                    </>



                                ))

                                }
                            </div>



                            <button type="button" className="upload" onClick={uploadImage}>
                                Upload
                            </button>



                            {/* {loading ? (
                                <div className="loading_">predicting...</div>
                            ) : (
                                <div className="result_">
                                    <div>Class = {data}</div>

                                    <div>Confidence = {confidence}</div>


                                </div>
                            )} */}







                        </div>
                    </div>
                </div>



            )}


        </body>
    )
}

export default Home