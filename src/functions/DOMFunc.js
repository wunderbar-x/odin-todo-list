const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

//function that generates task header

//function that generates task card
//makes empty card if subscription comes up with nothing?
const generateTaskCard = function(){
    const editText = function(event){
        const textElement = event.target;
        const input = document.createElement('input');
        textElement.style.display = 'none';
        input.classList.add('textEdit');
        input.value = textElement.innerHTML;
        input.type = 'text';
        textElement.parentNode.insertBefore(input,textElement);
        input.focus();

        //for enter key
        input.onkeydown = (ev) =>{
            if(ev.key == 'Enter'){
                finishEdit()
            }
            return;
        }
        //for clicking off input
        input.onblur = () =>{
            finishEdit();
        };

        const finishEdit = function(){
            textElement.innerHTML = input.value;
            input.parentNode.removeChild(input);
            textElement.style.display = '';
        }
    }
    const card = document.createElement('div');
    const cardHeader = document.createElement('div');
    const cardMain = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = 'placeholder title';
    title.addEventListener('click',editText);

    const priority = document.createElement('p');
    priority.textContent = 'priority';
    priority.addEventListener('click',editText);

    const dueDate = document.createElement('p');
    dueDate.textContent = 'dueDate';
    dueDate.addEventListener('click',editText);

    const description = document.createElement('p');
    description.textContent = 'description Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat officiis modi fugit distinctio dignissimos molestias animi cum! Perspiciatis sint unde nisi accusamus eaque facere, porro, sequi, sit illo quas eveniet.'
    description.addEventListener('click',editText);

    // seperate all creation into one module then return an object with all created elements and run in through the class adding function?
    const elementObj = {
        card,
        cardHeader,
        cardMain,
        title,
        priority,
        dueDate,
        description,
    };
    const elementNameArray = Object.keys(elementObj);

    for(let i=elementNameArray.length-1;i>=0;--i){
        elementObj[elementNameArray[i]].classList.add(`${elementNameArray[i]}`);
    };
    main.append(card);
    card.append(cardHeader,cardMain);
    cardHeader.append(title,priority,dueDate);
    cardMain.append(description);
};
export{generateTaskCard};