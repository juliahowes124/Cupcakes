$cupcakesList = $("#cupcakes-list")
$cupcakeForm = $("#new-cupcake-form")
$flavorInput = $("#flavor")
$ratingInput = $("#rating")
$sizeInput = $("#size")
$imageInput = $("#image")
$searchForm = $("#search-form")
$searchTerm = $("#search-term")
$editForm = $('.cupcake-edit')

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

	static async update(cupcakeInfo, cupcakeId) {
		let response = await axios({
			method: 'patch',
			url: `/api/cupcakes/${cupcakeId}`,
			data: cupcakeInfo
		});
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
		$cupcakesList.append(`<li class="cupcake" data-id="${cupcake.id}" style="cursor: pointer">${cupcake.flavor}</li>`)
	}
}


$editForm.hide();

$cupcakesList.on('click','.cupcake', (e) => {
	console.log($(e.target).data('id'));
	let flavor = $(e.target).text();
	$editForm.data('id', $(e.target).data('id'));
	$editForm.find('input[name="flavor"]').val(flavor)
	$editForm.find('input[name="size"]').val(flavor)
	$editForm.find('input[name="rating"]').val(flavor)
	$editForm.find('input[name="image"]').val(flavor)
	$editForm.show();
})

$editForm.on('submit', async (e) => {
	e.preventDefault();
	let cupcakeId = $editForm.data('id');
	let flavor = $editForm.find('input[name="flavor"]').val()
	let rating = +$editForm.find('input[name="rating"]').val()
	let size = $editForm.find('input[name="size"]').val()
	let image = $editForm.find('input[name="image"]').val()
	const { cupcake } = await Cupcake.update({flavor, rating, size, image}, cupcakeId) 
	console.log('updated, ', cupcake.flavor) // FIX THIS
})


start()