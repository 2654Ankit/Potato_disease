from fastapi import FastAPI,File,UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI()

origins = [
    "http://localhost:5173"

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

MODEL = tf.keras.models.load_model("../../saved_model.keras")
CLASS_NAME = ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']

# print(MODEL.summary())

@app.options("/predict")
async def options_preflight():
    return {"message":"CORS preflight handled"}
def read_file_as_image(data) -> np.array :
    image = np.array(Image.open(BytesIO(data)))
    return image


@app.get("/ping")
async def ping():
    return "welcome back"


@app.post("/predict")
async def predict(
        file : UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    image_batch  = np.expand_dims(image,0)
    prediction = MODEL.predict(image_batch)
    predicted_class = CLASS_NAME[np.argmax(prediction[0])]
    confidence = np.max(prediction[0])
    print(predicted_class,confidence)

    return {
        'class':predicted_class,
        'confidence':np.round(float(confidence),2)
    }



# if __name__ =="__main__":
#     uvicorn.run(app,host='localhost',port=8000,reload=True)