$cupcakesList = $("#cupcakes-list")
$cupcakeForm = $("#new-cupcake-form")
$flavorInput = $("#flavor")
$ratingInput = $("#rating")
$sizeInput = $("#size")
$imageInput = $("#image")
$searchForm = $("#search-form")
$searchTerm = $("#search-term")

async function start() {
	let response = await axios.get("/api/cupcakes")
	let { cupcakes } = response.data
	for (let cupcake of cupcakes) {
		$cupcakesList.append(`<li>${cupcake.flavor}</li>`) // helper function to add to DOM 
	}
}

$cupcakeForm.on('submit', async (e) => {
	e.preventDefault();
	//e.target fields from name attribute
	let flavor = $flavorInput.val();
	let rating = $ratingInput.val();
	let size = $sizeInput.val();
	let image = $imageInput.val();
	let response = await axios.post('/api/cupcakes', {
		flavor,
		rating,
		size,
		image
	})

	let { cupcakeFlavor } = response.data.cupcake;

	$cupcakesList.append(`<li>${cupcakeFlavor}</li>`)
})

$searchTerm.on("input", async (e) => {
	let searchTerm = $searchTerm.val();
	let response = await axios.get('/api/cupcakes', { params: { searchTerm } });
	addCupcakesToDom(response.data.cupcakes);
})


function addCupcakesToDom(cupcakes) {
	$cupcakesList.empty();
	for (let cupcake of cupcakes) {
		$cupcakesList.append(`<li>${cupcake.flavor}</li>`) // helper function to add to DOM 
	}
}
start()