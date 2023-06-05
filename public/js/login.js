const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = form.username.value
    const password = form.password.value

    try {
        const res = await fetch("/user/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })

        const data = await res.json()
        console.log(data)

        // if(data.errors) {
        //     emailError.textContent = data.errors.emailError
        //     passwordError.textContent = data.errors.password
        // }

        if (data.user) {
            location.assign('/transaction/send')
        }
    } catch (err) {
        console.log(err)
    }

    // console.log(response)
})

async function login(e) {

    // const response = await fetch("/user/login", {
    //     method: "POST",
    //     mode: "cors",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(username, password)
    // })
    // console.log(response)
}