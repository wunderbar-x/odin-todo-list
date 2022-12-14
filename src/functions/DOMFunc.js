import { pubsub } from "./pubsub";
import { format } from "date-fns";

export const DOMModule=(()=>{
    const taskTabs = document.getElementById('taskTabs');
    const newTaskButton = document.querySelector('#newTaskButton');
    newTaskButton.onclick =()=>{
        pubsub.publish('newTask',true);
    };
    const main = document.getElementById('main');

    const editFuncMod=(()=>{
        const taskEdit=(event)=>{
            let inputType;
            let input;
            const displayElement = event.target;
            if(displayElement.classList == 'title'||'date'){
                input = document.createElement('input');
                if(displayElement.classList == 'title'){
                    inputType = 'text';
                };
                if(displayElement.classList == 'dueDate'){
                    inputType = 'date';
                };
                input.type = `${inputType}`;
            };
            if(displayElement.classList == 'description'){
                input = document.createElement('textarea');
                inputType = 'textArea';
            };
            displayElement.style.display = 'none';
            input.classList.add(`${inputType}Edit`);
            input.value = displayElement.innerHTML;
            if(inputType == 'date'){
                input.min = getCurrentDate();
            };
            displayElement.parentNode.insertBefore(input,displayElement);
            input.focus();
            //finishes edit on enter press
            input.onkeydown=(keyboardEvent)=>{
                if(keyboardEvent.key == 'Enter'){
                    finishEdit()
                }
                return;
            };
            //finishes edit if the input loses focus
            input.onblur=()=>{
                finishEdit();
            };
            const finishEdit = function(){
                getCurrentDate();
                let displayValue = input.value;
                if(input.value == ''){
                    displayValue = `${displayElement.classList}`;
                };
                displayElement.innerHTML = displayValue;
                input.parentNode.removeChild(input);
                displayElement.style.display = '';
                pubsub.publish('newEdit',displayElement)
            };
        };
        const getCurrentDate=()=>{
            const today = new Date();
            return format(today,'yyyy-MM-dd');
        };
        return {taskEdit};
    })();

    const cardCreation=(()=>{
        //x is the taskObj
        const generateCard=(x)=>{
            let ID = '';
            let taskType = '';
            const card = document.createElement('div');
            const deleteButtonCont = document.createElement('div');
            const cardCont1 = document.createElement('div');
            const cardCont2 = document.createElement('div');
            const cardCont3 = document.createElement('div');
            if(x.isTask){
                ID = x.taskID;
                taskType = 'task';
            };
            if(!x.isTask){
                ID = x.subTaskID;
                taskType = 'subtask';
            };
            //can maybe add an "are you sure?" message later
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.setAttribute(`data-${taskType}-ID`,`${ID}`);
            deleteButton.onclick = function(){
                pubsub.publish('deleteTask',deleteButton);
            };

            const title = document.createElement('h2');
            // title.classList.add('editable');
            title.textContent = `${x.title}`;
            title.setAttribute(`data-${taskType}-ID`,`${ID}`);
            title.addEventListener('click',editFuncMod.taskEdit);

            const priorityCont = document.createElement('div');
            const priorityText = document.createElement('h5');
            priorityText.textContent = 'SET TASK PRIORITY';
            const generatePriorityText=()=>{
                priorityText.textContent = `${x.priority.toUpperCase()}`;
                priorityCont.style.gap = '10px';
            };
            if(x.priority!==''){
                generatePriorityText();
            };

            const priorityForm = document.createElement('form');
            priorityForm.setAttribute(`data-${taskType}-ID`,`${ID}`);

            const criticalLabel = document.createElement('label');
            criticalLabel.setAttribute('for','criticalInput');
            const importantLabel = document.createElement('label');
            importantLabel.setAttribute('for','importantInput');
            const normalLabel = document.createElement('label');
            normalLabel.setAttribute('for','normalInput');
            const finishedLabel = document.createElement('label');
            finishedLabel.setAttribute('for','finishedInput');

            const criticalInput = document.createElement('input');
            criticalInput.setAttribute('type','radio');
            criticalInput.setAttribute('value','critical');
            criticalInput.setAttribute('name','priority');
            criticalInput.setAttribute('title','CRITICAL');
            if(x.priority == 'critical'){
                criticalInput.setAttribute('checked','true');
            };
            criticalInput.addEventListener('click',()=>{
                pubsub.publish('priorityChange',criticalInput);
                generatePriorityText();
            });

            const importantInput = document.createElement('input');
            importantInput.setAttribute('type','radio');
            importantInput.setAttribute('value','important');
            importantInput.setAttribute('name','priority');
            importantInput.setAttribute('title','IMPORTANT')
            if(x.priority == 'important'){
                importantInput.setAttribute('checked','true');
            };
            importantInput.addEventListener('click',()=>{
                pubsub.publish('priorityChange',importantInput);
                generatePriorityText();
            });

            const normalInput = document.createElement('input');
            normalInput.setAttribute('type','radio');
            normalInput.setAttribute('value','normal');
            normalInput.setAttribute('name','priority');
            normalInput.setAttribute('title','NORMAL');
            if(x.priority == 'normal'){
                normalInput.setAttribute('checked','true');
            };
            normalInput.addEventListener('click',()=>{
                pubsub.publish('priorityChange',normalInput);
                generatePriorityText();
            });

            const finishedInput = document.createElement('input');
            finishedInput.setAttribute('type','radio');
            finishedInput.setAttribute('value','finished');
            finishedInput.setAttribute('name','priority');
            finishedInput.setAttribute('title','FINISHED');
            if(x.priority == 'finished'){
                finishedInput.setAttribute('checked','true');
            };
            finishedInput.addEventListener('click',()=>{
                pubsub.publish('priorityChange',finishedInput);
                generatePriorityText();
            });

            const dueDate = document.createElement('p');
            // dueDate.classList.add('editable');
            dueDate.textContent = `${x.dueDate}`;
            dueDate.setAttribute(`data-${taskType}-ID`,`${ID}`);
            dueDate.addEventListener('click',editFuncMod.taskEdit);
        
            const description = document.createElement('p');
            // description.classList.add('editable');
            description.textContent = `${x.description}`;
            description.setAttribute(`data-${taskType}-ID`,`${ID}`);
            description.addEventListener('click',editFuncMod.taskEdit);

            // seperate all creation into one module then return an object with all created elements and run in through the class adding function?
            const elementObj = {
                card,
                deleteButtonCont,
                deleteButton,
                cardCont1,
                priorityCont,
                priorityText,
                priorityForm,
                criticalLabel,
                criticalInput,
                importantLabel,
                importantInput,
                normalLabel,
                normalInput,
                finishedLabel,
                finishedInput,
                cardCont2,
                cardCont3,
                title,
                dueDate,
                description,
            };
            const elementNameArray = Object.keys(elementObj);
        
            //Adds a class to every array element equal to their variable name
            for(let i=elementNameArray.length-1;i>=0;--i){
                elementObj[elementNameArray[i]].classList.add(`${elementNameArray[i]}`);
            };

            main.append(card);
            card.append(deleteButtonCont,cardCont1,cardCont2,cardCont3);
            deleteButtonCont.append(deleteButton);
            cardCont1.append(title,priorityCont);
            priorityCont.append(priorityText,priorityForm);
            priorityForm.append(criticalLabel,criticalInput,importantLabel,importantInput,normalLabel,normalInput,finishedLabel,finishedInput);
            cardCont2.append(dueDate);
            cardCont3.append(description);

            //if x is a main task create the newsubtask button
            if(x.isTask){
                const newSubTaskButton = document.createElement('button');
                newSubTaskButton.textContent = 'ADD NEW SUBTASK';
                newSubTaskButton.classList.add('newSubTaskButton');
                newSubTaskButton.onclick = function(){
                    console.log('create new subtask');
                    pubsub.publish('createNewSubTask',true);
                };
                main.appendChild(newSubTaskButton);
            };
        };
        return{generateCard};
    })();

    //renders the current task and its subtasks
    const renderTaskMod=(()=>{
        const renderTask=(currentTask)=>{
            const getRenderArray=(x)=>{
                const renderArray = [x];
                x.subTaskArray.forEach(e => renderArray.push(e));
                return renderArray;
            };
            if(currentTask === undefined){
                main.replaceChildren();
                return;
            };
            main.replaceChildren();
            const renderArray = getRenderArray(currentTask);
            console.log(renderArray);
            renderArray.forEach(e=>cardCreation.generateCard(e));
        };
        pubsub.subscribe('newCurrentTask',renderTask);
        pubsub.subscribe('newSubTask',renderTask);
        pubsub.subscribe('subTaskDeleted',renderTask);
        pubsub.subscribe('loadFirstTask',renderTask);
        return{renderTask};
    })();
    
    //function to generate sidebar tabs whenever a new taskObj is stored/deleted, or a relevant task element is changed.
    const taskTabCreation = (() =>{
        const generateTaskTabs = function(taskArray){
            taskTabs.replaceChildren();
            taskArray.forEach((e)=>{
                //e is a task object
                const tab = document.createElement('div')
                tab.classList.add('tab')
                tab.setAttribute('data-tab-ID',`${e.taskID}`);
                tab.addEventListener('click',()=>{
                    pubsub.publish('tabSelected',e);
                });

                const tabCont1 = document.createElement('div');
                tabCont1.classList.add('tabCont1');

                const tabHeading = document.createElement('h3');
                tabHeading.classList.add('tabHeading');
                tabHeading.textContent = `${e.title}`;
                
                const tabPriority = document.createElement('span');
                tabPriority.classList.add('tabPriority');
                switch(e.priority){
                    case 'critical':
                        tabPriority.style.backgroundColor = 'red';
                        break;
                    case 'important':
                        tabPriority.style.backgroundColor = 'orangered';
                        break;
                    case 'normal':
                        tabPriority.style.backgroundColor = 'yellow';
                        break;
                    case 'finished':
                        tabPriority.style.backgroundColor = 'yellowgreen';
                        break;
                    default:
                        tabPriority.style.backgroundColor = 'rgb(201,201,201)';
                        break;
                };

                const tabCont2 = document.createElement('div');
                tabCont2.classList.add('tabCont2');

                const tabDueDate = document.createElement('p');
                tabDueDate.classList.add('tabDueDate');
                tabDueDate.textContent = `${e.dueDate}`;

                taskTabs.append(tab);
                tab.append(tabCont1,tabCont2);
                tabCont1.append(tabHeading,tabPriority);
                tabCont2.append(tabDueDate);
            });
        };
        pubsub.subscribe('tabElementChange',generateTaskTabs);
        pubsub.subscribe('taskStorageChange',generateTaskTabs);
        pubsub.subscribe('userStorageLoaded',generateTaskTabs);
    })();
})();