'use strict'
//get saved todos
const getTodoList=()=>{
    const todoJSON=localStorage.getItem('todos')
    try{if(todoJSON){
        return JSON.parse(todoJSON)
    }}catch(error){
        return []

    }
}

//save todos to local storage
const saveTodoStorage=()=> localStorage.setItem('todos',JSON.stringify(toDoList))



//render to dos based on filters
const renderUserList=(list,filters)=>{
    const div=document.querySelector('#users').innerHTML=''
    list.forEach((item,index)=>{
        if(item.text.toLowerCase().includes(filters.searchText.toLowerCase())){
            if(filters.hideCompleted){
                if(!item.completed){
                    const itemDOM=generateTodoDOM(item)
                    document.querySelector('#todos').appendChild(itemDOM)          
                }
            }else{
                const itemDOM=generateTodoDOM(item)
                document.querySelector('#todos').appendChild(itemDOM)          
            }

        }
    })
    document.querySelector('#todos').appendChild(generateSummaryDOM())

}

//remove by id
const removeById=(id)=>{
    const indexId=toDoList.findIndex((item,index)=> id===item.id)
    if(indexId>-1){
        toDoList.splice(indexId,1)
    }
}
//change completed if check
const changeComplete=(id,checked)=>{
    const itemIndex=toDoList.findIndex(function(item){
        return item.id===id
    })
    if(itemIndex>-1){
        toDoList[itemIndex].completed=!(toDoList[itemIndex].completed)
    }

}
//generate  dom elements for an individual note
const generateTodoDOM=(item)=>{
    const itemDOM=document.createElement('div')
    const textDOM=document.createElement('span')
    // const checkDOM=document.createElement('input')
    const butttonDOM=document.createElement('button')
    //set up checkbox
    // checkDOM.setAttribute('type','checkbox')
    // checkDOM.checked=item.completed
    // checkDOM.addEventListener('change',function(event){
    //     changeComplete(item.id,checkDOM.checked)
    //     saveTodoStorage()
    //     renderList(toDoList,filters)
    // })
    // itemDOM.appendChild(checkDOM)

    //set up text 
    textDOM.textContent=item.firstName
    itemDOM.appendChild(textDOM)

    //set up remove element
    butttonDOM.textContent='Add Friend'
    butttonDOM.addEventListener('click',()=>{
        removeById(item.id)
        saveTodoStorage()
        renderList(toDoList)
    })
    itemDOM.appendChild(butttonDOM)
    return itemDOM
}

//get dom elements for list summary
const generateSummaryDOM=()=>{
    let numberLeftToDo=0
    toDoList.filter((item,index)=>{
        if(item.completed){
            return true
        }
        numberLeftToDo++
        return false
    })
    console.log(numberLeftToDo)
    const summaryElement=document.createElement('h2')
    summaryElement.textContent='you have : ' + numberLeftToDo+ ' left to do'
    return summaryElement
}