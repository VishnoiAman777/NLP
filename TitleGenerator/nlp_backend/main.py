from typing import Union
from fastapi import FastAPI
# Importing the saved Models
from simpletransformers.seq2seq import Seq2SeqModel
from simpletransformers.t5 import T5Model
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

# Model Args
model_args = {
    "reprocess_input_data": True,
    "overwrite_output_dir": True,
    "save_model_every_epoch": False,
    "save_eval_checkpoints": False,
    "max_seq_length": 512,
    "train_batch_size": 6,
    "num_train_epochs": 3,
    "evaluate_generated_text": True,
}

# Loading the models
Marian = Seq2SeqModel(
    encoder_decoder_type="marian",
    encoder_decoder_name="Models/Marian/Marian/outputs",
    args=model_args,
    use_cuda=False
)
T5 = T5Model(
    "t5",
    "Models/T5/T5/outputs",
    args=model_args,
    use_cuda=False
)
# Create a Bart-base model
BART = Seq2SeqModel(encoder_decoder_type="bart",
                    encoder_decoder_name="Models/BART/BART/outputs",
                    args=model_args,
                    use_cuda=False)

app = FastAPI()

class Paper(BaseModel):
    abstract: str
    title: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def fast_api():
    return {"Hello": "World"}


@app.post("/model_predict")
def read_item(paper: Paper):
    dic = {"marian": Marian.predict([paper.abstract])[0], "bart": BART.predict([paper.abstract])[0], "t5": T5.predict([paper.abstract])[0]}
    return json.dumps(dic)
