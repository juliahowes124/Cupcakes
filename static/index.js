$cupcakesList = $("#cupcakes-list")
$ingredientsListCreate = $("#ingredients-list-create")
$ingredientsListEdit = $("#ingredients-list-edit")
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
	displayIngredientsOnForm($ingredientsListCreate);
}

async function displayIngredientsOnForm(form) {
	const response = await axios.get("/api/ingredients");
	const { ingredients } = response.data;
	for (let {id, name} of ingredients) {
		form.append(`
			<input type="checkbox" id="${id}" name="${name}">
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
	let image = $imageInput.val() || null;
	let ingredientIds = [];
	for (let checkbox of $('input[type=checkbox]')) {
		if(checkbox.checked) {
			ingredientIds.push(checkbox.id)
		}
	}
	const { cupcake } = await Cupcake.create({flavor, rating, size, image, ingredientIds}) 
	$cupcakesList.append(`<li>${cupcake.flavor}</li>`)
})

$searchTerm.on("input", async (e) => {
	const { cupcakes } = await Cupcake.getAll($searchTerm.val());
	addCupcakesToDom(cupcakes);
})

function generateCupcakeCard(cupcake) {
	const {id, flavor, image, ingredients, size, rating} = cupcake;
	const ingredientHtml = ingredients.reduce((acc, el) => {
		acc = acc + `<li class="list-group-item">${el}</li>`;
		return acc;
	}, '');
	return `
		<div class="card cupcake" style="width: 18rem;" data-id="${id}" style="cursor: pointer">
			<img src="${image}" class="card-img-top" alt="${flavor}">
			<div class="card-body">
				<h5 class="card-title cupcake-flavor">${flavor}</h5>
				<p class="cupcake-size">${size}<p>
				<p class="cupcake-rating">${rating}<p>
			</div>
			<ul class="list-group list-group-flush">
				${ingredientHtml}
			</ul>
			<div class="card-body">
				<button class="edit-btn btn btn-secondary">Edit</button>
				<button class="delete-btn btn btn-danger">Delete</button>
			</div>
		</div>
	`
}


function addCupcakesToDom(cupcakes) {
	$cupcakesList.empty();
	for (let cupcake of cupcakes) {
		$cupcakesList.append(generateCupcakeCard(cupcake))
	}
}


$editForm.hide();

$cupcakesList.on('click','.edit-btn', (e) => {
	const $cupcakeLi = $(e.target).closest('.cupcake');
	let flavor = $cupcakeLi.find('.cupcake-flavor').text();
	let size = $cupcakeLi.find('.cupcake-size').text();
	let rating = $cupcakeLi.find('.cupcake-rating').text();
	$editForm.data('id', $cupcakeLi.data('id'));
	$editForm.find('input[name="flavor"]').val(flavor)
	$editForm.find('input[name="size"]').val(size)
	$editForm.find('input[name="rating"]').val(rating)
	$editForm.show();
	displayIngredientsOnForm($ingredientsListEdit);
})

$editForm.on('submit', async (e) => {
	e.preventDefault();
	let cupcakeId = $editForm.data('id');
	console.log(cupcakeId);
	let flavor = $editForm.find('input[name="flavor"]').val()
	let rating = +$editForm.find('input[name="rating"]').val()
	let size = $editForm.find('input[name="size"]').val()
	let image = $editForm.find('input[name="image"]').val() || null;
	let ingredientIds = [];
	for (let checkbox of $('input[type=checkbox]')) {
		if(checkbox.checked) {
			ingredientIds.push(checkbox.id);
		}
	}
	await Cupcake.update({flavor, rating, size, image, ingredientIds}, cupcakeId) 
	let { cupcakes } = await Cupcake.getAll();
	addCupcakesToDom(cupcakes);
	$editForm.hide();
})

$cupcakesList.on('click','.delete-btn', async (e) => {
	const cupcakeId = $(e.target).closest('li').data('id');
	await Cupcake.delete(cupcakeId);
	$(e.target).closest('li').remove();
})

start()