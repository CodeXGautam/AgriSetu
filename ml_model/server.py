# server.py
from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import ViTForImageClassification, ViTImageProcessor
from PIL import Image
import requests
from io import BytesIO

app = FastAPI()

model_name = "wambugu71/crop_leaf_diseases_vit"
model = ViTForImageClassification.from_pretrained(model_name)
processor = ViTImageProcessor.from_pretrained(model_name)


class ImageRequest(BaseModel):
    image_url: str

@app.post("/predict")
def predict(req: ImageRequest):
    # Load image from URL
    response = requests.get(req.image_url)
    image = Image.open(BytesIO(response.content)).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        logits = model(**inputs).logits

    predicted_class_idx = logits.argmax(-1).item()
    label = model.config.id2label[predicted_class_idx]

    return {"prediction": label}

# test_req = ImageRequest(
#     image_url="https://blog.plantwise.org/wp-content/uploads/sites/7/2022/05/sphacr1.jpg"
# )

# print(predict(test_req))