$cupcakesList = $("#cupcakes-list")
$ingredientsList = $("#ingredients-list")
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

	static async delete(cupcakeId) {
		await axios.delete(`/api/cupcakes/${cupcakeId}`);
	}
	
}

async function start() {
	let { cupcakes } = await Cupcake.getAll();
	addCupcakesToDom(cupcakes);
	displayIngredientsOnForm();
}

async function displayIngredientsOnForm() {
	const response = await axios.get("/api/ingredients");
	const { ingredients } = response.data;
	for (let {id, name} of ingredients) {
		$ingredientsList.append(`
			<input type="checkbox" id="${name}" name="${name}">
      <label for="${name}">${name}</label>
		`)
	}
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
		$cupcakesList.append(`<li class="cupcake" data-id="${cupcake.id}" style="cursor: pointer">
													<p class="cupcake-flavor">${cupcake.flavor}<p>
													<p class="cupcake-size">${cupcake.size}<p>
													<p class="cupcake-rating">${cupcake.rating}<p>
													<p class="cupcake-rating">${cupcake.ingredients}<p>
													<button class="delete-btn">Delete</button>
													</li>`)
	}
}


$editForm.hide();

$cupcakesList.on('click','.cupcake', (e) => {
	const $cupcakeLi = $(e.target).parent()
	let flavor = $cupcakeLi.find('.cupcake-flavor').text();
	let size = $cupcakeLi.find('.cupcake-size').text();
	let rating = $cupcakeLi.find('.cupcake-rating').text();
	$editForm.data('id', $cupcakeLi.data('id'));
	$editForm.find('input[name="flavor"]').val(flavor)
	$editForm.find('input[name="size"]').val(size)
	$editForm.find('input[name="rating"]').val(rating)
	$editForm.show();
})

$editForm.on('submit', async (e) => {
	e.preventDefault();
	let cupcakeId = $editForm.data('id');
	let flavor = $editForm.find('input[name="flavor"]').val()
	let rating = +$editForm.find('input[name="rating"]').val()
	let size = $editForm.find('input[name="size"]').val()
	let image = $editForm.find('input[name="image"]').val()
	await Cupcake.update({flavor, rating, size, image}, cupcakeId) 
	let { cupcakes } = await Cupcake.getAll();
	addCupcakesToDom(cupcakes);
	$editForm.hide();
})

$cupcakesList.on('click','.delete-btn', async (e) => {
	const cupcakeId = $(e.target).parent().data('id');
	await Cupcake.delete(cupcakeId);
	$(e.target).parent().remove();
})

start()