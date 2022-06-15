var slist = {
    // 1.0 Initiate
    items : [],
    shoppingForm : null,
    shoppingQty : null,
    shoppingItem : null,
    shoppingItemAdd : null,
    shoppingList : null,
    shoppingListText : null,

    init : () => {
        // 1.1 Get HTML elements
        slist.shoppingForm = document.getElementById("shopping-form");
        slist.shoppingQty = document.getElementById("shopping-qty");
        slist.shoppingItem = document.getElementById("shopping-item");
        slist.shoppingItemAdd = document.getElementById("shopping-item-add");
        slist.shoppingList = document.getElementById("shopping-list");
        slist.shoppingFooter = document.getElementById("shopping-footer");
        slist.shoppingListSummary = document.getElementById("shopping-list-summary");
        slist.notice = document.getElementById("notice");

        // 1.2 Set attributes for input
        slist.shoppingItem.setAttribute("autocomplete", "off");
        slist.shoppingForm.onsubmit = slist.add;
        slist.shoppingItem.disabled = false;
        slist.shoppingItemAdd.disabled = false;
        
        // 1.3 Retrieve from local storage if defined
        if (localStorage.items == undefined) {
            localStorage.items = "[]";
        }
        slist.items = JSON.parse(localStorage.items);

        // 1.4 Render the list
        slist.render();
    },

    // 2 Save items to local storage
    save : () => {
        if (localStorage.items == undefined) {
            localStorage.items = "[]";
        }
        localStorage.items = JSON.stringify(slist.items);
    },
    
    // 3 Add new item to the list
    add : (evt) => {
        // 3.1 don't allow form submit
        evt.preventDefault();

        // Proceed if first letter is capital
        if(slist.shoppingItem.value[0].toUpperCase() === slist.shoppingItem.value[0]) {

            // Reset error 
            slist.shoppingItem.classList.remove('error');
            slist.notice.classList.add('d-none');

            // 3.2 add the new item to the list
            for(i = 1; i <= slist.shoppingQty.value; i++) {
                slist.items.push({
                    name : slist.shoppingItem.value, // item name
                    done : false // true for "got it", false for "not yet"
                });
            }
            slist.shoppingItem.value = "";
            slist.shoppingQty.value = "1";
            slist.save();

            // 3.3 Re-render the list
            slist.render();
            
        } else {
            slist.shoppingItem.classList.add('error');
            slist.notice.classList.remove('d-none');
        }
    },
    
    // 4 Clear the shopping list
    clear : () => {
        if (confirm("Are you sure you want to clear this list?")) {
            slist.items.splice(0, slist.items.length);
            slist.save();
            slist.render();
            slist.shoppingFooter.classList.add("d-none");
            slist.notice.classList.add('d-none');
            slist.shoppingItem.value = "";
            slist.shoppingQty.value = "1";
            slist.shoppingItem.classList.remove('error');
        }
    },

    // 5 share shopping list with WhatsApp
    share : () => {

        // 5.1 Reset shopping list message
        slist.shoppingListText = "Hey there! %0D%0AHere's the shopping list: %0D%0A";

        // 5.2 Add ites to the message
        if (slist.items.length == 0) {
            alert("Cannot share empty shopping list!");
        } else {
            for (let i in slist.items) {
                slist.shoppingListText += '- ' + slist.items[i].name + '%0D%0A';
            }
            window.open('whatsapp://send?text=' + slist.shoppingListText);
        }
    },

    // 6. Toggle between selected and not selected
    toggle : (id) => {
        slist.items[id].done = !slist.items[id].done;
        slist.save();
        slist.render();
    },

    // 7. Render the shopping list
    render : () => {
        // 7.1 reset HTML
        slist.shoppingList.innerHTML = "";

        // 7.2 if no items
        if (slist.items.length == 0) {
            slist.shoppingList.innerHTML = "<div class='item'>Shopping list is empty.</div>";
            slist.shoppingListSummary.innerHTML = "";
        }

        // 7.3 reneder itms
        else {
            selected = 0;
            for (let i in slist.items) {
                // row
                let row = document.createElement("div");
                row.className = "item-row";
                slist.shoppingList.appendChild(row);

                // item
                let name = document.createElement("div");
                name.innerHTML = slist.items[i].name;
                name.className = "item";
                if (slist.items[i].done) {
                    name.classList.add("selected");
                    selected++;
                }
                name.onclick = () => { slist.toggle(i); };
                row.appendChild(name);
            }
            remainingItems = slist.items.length - selected;
            slist.shoppingListSummary.innerHTML = "Noch " + remainingItems + " von "  + slist.items.length + " Einträgen";
            slist.shoppingFooter.classList.remove("d-none");
        }
    }
};
window.addEventListener("load", slist.init);