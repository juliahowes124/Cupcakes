$cupcakesList = $("#cupcakes-list")
$ingredientsListCreate = $("#ingredients-list-create")
$ingredientsListEdit = $("#ingredients-list-edit")
$cupcakeForm = $("#new-cupcake-form")
$ingredientForm = $("#new-ingredient-form")
$flavorInput = $("#flavor")
$ratingInput = $("#rating")
$sizeInput = $("#size")
$imageInput = $("#image")
$searchForm = $("#search-form")
$searchTerm = $("#search-term")
$editForm = $('.cupcake-edit')
$addCupcakeBtn = $('.add-cupcake-btn')
$addIngredientBtn = $('.add-ingredient-btn')

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

async function displayIngredientsOnForm(divToAdd, checkedIngredients) {
	const response = await axios.get("/api/ingredients");
	const { ingredients } = response.data;
	divToAdd.empty();
	for (let {id, name} of ingredients) {
		let checked = false;
		if (checkedIngredients) {
			checked = checkedIngredients.includes(name);
		}
		divToAdd.append(`
			<input type="checkbox" id="${id}" name="${name}" ${checked ? "checked": ""}>
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
	$cupcakesList.append(generateCupcakeCard(cupcake));
	$cupcakeForm.hide();
});

$ingredientForm.on('submit', async (e) => {
	e.preventDefault();
	let newIngredient = $ingredientForm.find('#name').val().trim();
	if(newIngredient === '') {
		alert('Ingredient must have a name');
		return
	}
	await axios.post("/api/ingredients", {name: newIngredient});
	alert(`${newIngredient} added to ingredients!`);
	$ingredientForm.hide();
	$cupcakeForm.show();
	displayIngredientsOnForm($ingredientsListCreate);
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
		<div class="card cupcake my-3 w-100" style="width: 18rem;" data-id="${id}" style="cursor: pointer">
			<img src="${image}" class="card-img-top" height=300 alt="${flavor}" style="object-fit: cover">
			<div class="card-body">
				<h5 class="card-title cupcake-flavor">${flavor}</h5>
				<span class="cupcake-size badge bg-info">${size}</span>
				<span class="cupcake-rating badge bg-warning">${rating}</span>
			</div>
			<ul class="list-group list-group-flush cupcake-ingredients">
				${ingredientHtml}
			</ul>
			<div class="card-body">
			<button class="delete-btn btn btn-danger float-right m-1">Delete</button>
				<button class="edit-btn btn btn-secondary float-right m-1">Edit</button>
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
$ingredientForm.hide();

$cupcakesList.on('click','.edit-btn', (e) => {
	const $cupcakeLi = $(e.target).closest('.cupcake');
	let flavor = $cupcakeLi.find('.cupcake-flavor').text();
	let size = $cupcakeLi.find('.cupcake-size').text();
	let rating = $cupcakeLi.find('.cupcake-rating').text();
	let ingredients = $cupcakeLi.find('.cupcake-ingredients').children();
	let checkedIngredients = $.map(ingredients, (i) => $(i).text());

	$editForm.data('id', $cupcakeLi.data('id'));
	$editForm.find('input[name="flavor"]').val(flavor)
	$editForm.find('input[name="size"]').val(size)
	$editForm.find('input[name="rating"]').val(rating)
	$editForm.show();
	$ingredientForm.hide();
	$cupcakeForm.hide();
	displayIngredientsOnForm($ingredientsListEdit, checkedIngredients);
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
	const cupcakeId = $(e.target).closest('.cupcake').data('id');
	await Cupcake.delete(cupcakeId);
	$(e.target).closest('.cupcake').remove();
})

$addCupcakeBtn.on('click', () => {
	$ingredientForm.hide();
	$editForm.hide();
	$cupcakeForm.show();
});

$addIngredientBtn.on('click', () => {
	$cupcakeForm.hide();
	$editForm.hide();
	$ingredientForm.show();
});

start()