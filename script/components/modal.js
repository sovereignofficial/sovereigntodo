import { generateRandomColor } from "../lib/generateColor.js";

export class Modal{
    constructor(type){
        this._title = type.charAt(0).toUpperCase() + type.slice(1);
        this._form = type === "list"
        ? [
            {
                input:{
                    type:"text",
                    placeholder:"List Name",
                    class:"task-title",
                    id:"list-input"
                },
                submitButton:{
                    type:"submit",
                    id:"generate-list",
                    class:"view-add-btn"
                }
            }
        ] : [
            {
                input:{
                    type:"text",
                    placeholder:"Tag Name",
                    class:"task-title",
                    id:"tag-input"
                },
                submitButton:{
                    type:"submit",
                    id:"generate-tag",
                    class:"view-add-btn"
                }
            }
        ];
        this._open = false;
        
    }
    renderModal(){
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = this._title;
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = '';
        const inputElement = document.createElement('input');
        inputElement.style.width ="50%";
        const buttonElement = document.createElement('button');
        buttonElement.textContent="Create";

        Object.keys(this._form[0].input).forEach(key=>{
            inputElement.setAttribute(key,this._form[0].input[key])
        });
        Object.keys(this._form[0].submitButton).forEach(key=>{
            buttonElement.setAttribute(key,this._form[0].submitButton[key])
        });
        modalContent.appendChild(inputElement);
        modalContent.appendChild(buttonElement);
    }
    openModal(){
        this._open = true;
        const modal = document.getElementById('modal-bg');
        modal.style.display = "flex";
        this.renderModal();
    }
    closeModal(){
        this._open = false;
        const modal = document.getElementById('modal-bg');
        modal.style.display = "none";
    }
    onSubmit(){
        if(this._title === "List"){
            const listInput = document.getElementById('list-input').value;
            if(listInput.trim().length < 1) throw new Error('Please type a new list!');
            const newList = new List(listInput);
            return newList;
        }else{
            const tagInput = document.getElementById('tag-input').value;
            if(tagInput.trim().length < 1) throw new Error('Please type a new tag!');
            const newTag = new Tag(tagInput,generateRandomColor());
            return newTag;
        }
    }
}

