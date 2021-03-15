cupcakesList = $("#cupcakes-list")

async function start() {
    console.log("test")
    console.log(cupcakesList)
    let response = await axios.get("/api/cupcakes")

    console.log(response)
    cupcakes = response.data.cupcakes
    console.log(cupcakes)
    for (let cupcake of cupcakes) {
        cupcakesList.append(`<li>${ cupcake.flavor }</li>`)
    }
}

start()