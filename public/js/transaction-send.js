const getReceiverContainer = document.getElementById('receiver')

// receiver drop down
const getReceiver = async () => {
    try {
        const res = await fetch('/user/getUsersEx', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const result = await res.json()
        userArr = result.users
        userArr.forEach(e => {
            const createReceiverOption = document.createElement('option')
            createReceiverOption.value = e.id
            createReceiverOption.textContent = e.username

            getReceiverContainer.appendChild(createReceiverOption)
        });
    } catch (error) {
        console.log(error);
    }
}
getReceiver()

const getLogs = async () => {
    try {
        const result = await fetch('/transaction/logs', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        const res = await result.json()
        return res.data
    } catch (err) {
        console.log('err: ', err);
    }
}

const inputToLog = async () => {
    const getTBody = document.querySelector('tbody')

    getTBody.innerHTML = ''
    const logs = await getLogs()
    logs.forEach((e, i) => {
        const createTR = document.createElement('tr')
        getTBody.appendChild(createTR)
        // console.log('e: ', e)
        // const arrayLog = Object.values(e)
        // console.log('arrayLog: ', arrayLog)

        // const createTD = document.createElement('td')

        const dateTimeString = e.createdAt
        const dateTime = new Date(dateTimeString);
        const convertedDateTime = new Date(dateTime.getTime() + (7 * 60 * 60 * 1000));

        
        // const [year, month, date, hours, minutes, seconds] = convertedDateTime.split(/[-T:.Z]/g).map(Number);
        
        textContent =
            `
            <td>${i + 1}</td>
            <td>${e.user.username}</td>
            <td class="align-right">${e.amount}</td>
            <td>${convertedDateTime}</td>
            `
        createTR.innerHTML = textContent

    })
}

inputToLog()

const form = document.querySelector('form')

// submit button
form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const receiverId = form.receiver.value
    const amount = form.amount.value

    // console.log(receiverId)
    // console.log(amount)

    try {
        const res = await fetch("/transaction/send", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiverId, amount })
        })

        const data = await res.json()
        // console.log(data)

        // if(data.errors) {
        //     emailError.textContent = data.errors.emailError
        //     passwordError.textContent = data.errors.password
        // }

        if (data.message == 'Transaction success') {
            alert('Transaction success')
        }
        inputToLog()
    } catch (err) {
        alert('Transaction failed, Try again later')
    }

    // console.log(response)
})
