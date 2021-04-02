$cupcakesList = $("#cupcakes-list")
$cupcakeForm = $("#new-cupcake-form")
$flavorInput = $("#flavor")
$ratingInput = $("#rating")
$sizeInput = $("#size")
$imageInput = $("#image")
$searchForm = $("#search-form")
$searchTerm = $("#search-term")

class Cupcake {
	static async getAll(searchTerm) {
		const response = await axios.get("/api/cupcakes",  { params: { searchTerm } });
		const { cupcakes } = response.data;
		return { cupcakes };
	}

	static async create(cupcakeInfo) {
		let response = await axios.post('/api/cupcakes', cupcakeInfo)
		let { cupcake } = response.data;
		return { cupcake };
	}
}

async function start() {
	let { cupcakes } = await Cupcake.getAll();
	addCupcakesToDom(cupcakes);
}

$cupcakeForm.on('submit', async (e) => {
	e.preventDefault();
	//e.target fields from name attribute
	let flavor = $flavorInput.val();
	let rating = $ratingInput.val();
	let size = $sizeInput.val();
	let image = $imageInput.val();
	const { cupcake } = await Cupcake.create({flavor, rating, size, image}) 
	$cupcakesList.append(`<li>${cupcake.flavor}</li>`)
})

$searchTerm.on("input", async (e) => {
	const { cupcakes } = await Cupcake.getAll($searchTerm.val());
	addCupcakesToDom(cupcakes);
})


function addCupcakesToDom(cupcakes) {
	$cupcakesList.empty();
	for (let cupcake of cupcakes) {
		$cupcakesList.append(`<li>${cupcake.flavor}</li>`)
	}
}
start()