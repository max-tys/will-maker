"use strict"

// ##### GENERIC FUNCTIONS #####

// Create an element with attributes and textContent
// Function has named parameters via destructured objects
// https://stackoverflow.com/questions/2946656/advantages-of-createelement-over-innerhtml
function createHTMLElement({ element, attributes = {}, text = '' } = {}) {
  const newElement = document.createElement(element);

  Object.keys(attributes).forEach((attribute) => {
    newElement.setAttribute(attribute, attributes[attribute]);
  });
  
  newElement.textContent = text;

  return newElement;
}

// Automatically fills the preview as you type
function autofill(attribute) {
  // Attribute input fields are unique
  const attributeField = document.querySelector(`#${attribute}Field`);

  // Attributes may be displayed multiple times in the preview
  const attributeDisplay = document.querySelectorAll(`.${attribute}Display`);

  // Add event listener to input field
  attributeField.addEventListener('input', () => {
    attributeDisplay.forEach(attr => {
      attr.textContent = attributeField.value;
    });
  });
}

// ##### DISTRIBUTION OF RESIDUARY ESTATE #####
// Removes children fieldset and display, add beneficiary fieldset
// Used by the first two radio buttons
function createBeneficiariesFieldset() {
  // Remove children fieldset if it exists
  if (document.querySelector('.childrenFieldset')) {
    document.querySelector('.childrenFieldset').remove();
  }
  
  // Remove children clause from display if it exists
  const childrenClauseDisplay = document.querySelector('.childrenClauseDisplay');
  if (childrenClauseDisplay) childrenClauseDisplay.remove();
  
  // Add beneficiaries fieldset if it doesn't exist
  function beneficiariesFieldsetHTML() {
    // <fieldset>
    const fieldset = createHTMLElement({
      element: 'fieldset',
      attributes: { class: 'beneficiariesFieldset' }
    });
  
    // <legend> Beneficiaries
    fieldset.appendChild(createHTMLElement({
      element: 'legend',
      text: 'Beneficiaries'
    }));
  
    // <button> Add Beneficiary
    fieldset.appendChild(createHTMLElement({
      element: 'button',
      attributes: {
        type: 'button',
        class: 'btn btn-outline-primary me-1',
        id: 'addBeneficiaryBtn'
      },
      text: 'Add Beneficiary'
    }));
  
    // <button> Remove Beneficiary
    fieldset.appendChild(createHTMLElement({
      element: 'button',
      attributes: {
        type: 'button',
        class: 'btn btn-outline-secondary',
        id: 'removeBeneficiaryBtn'
      },
      text: 'Remove Beneficiary'
    }));
  
    return fieldset;
  }
  if (!document.querySelector('.beneficiariesFieldset')) {
    // Add beneficiaries fieldset after residuary fieldset
    document
    .querySelector('#residuaryFieldset')
    .after(beneficiariesFieldsetHTML());
  
    // Keep track of number of beneficiaries
    let beneficiaryCount = 0;
  
    // Event listener for <button> Add Beneficiary
    function addBeneficiaryHandler() {
      // Increment beneficiaryCount
      beneficiaryCount += 1;
  
      // Create input fields for beneficiary
      function inputFieldsforBeneficiary() {
        // Create two input fields for each beneficiary, wrapped in a <div>
        const beneficiaryInputs = createHTMLElement({
          element: 'div',
          attributes: { class: `mt-3 beneficiary${beneficiaryCount}` },
        })
  
        // Sub-label for each beneficiary
        const sublabel = createHTMLElement({
          element: 'p',
          attributes: { class: 'lead' },
          text: `Beneficiary ${beneficiaryCount}`
        });
        beneficiaryInputs.appendChild(sublabel);
  
        // input field 1: beneficiary name
        const beneficiaryName = createHTMLElement({
          element: 'div',
          attributes: { class: 'form-floating mt-3' }
        });
        beneficiaryName.appendChild(createHTMLElement({
          element: 'input',
          attributes: {
            name: `beneficiary${beneficiaryCount}NameField`,
            id: `beneficiary${beneficiaryCount}NameField`,
            placeholder: `Beneficiary ${beneficiaryCount}'s Full Name`,
            type: 'text',
            class: 'form-control',
            required: ''
          }
        }));
        beneficiaryName.appendChild(createHTMLElement({
          element: 'label',
          attributes: { for: `beneficiary${beneficiaryCount}NameField` },
          text: `Beneficiary ${beneficiaryCount}'s Full Name`
        }));
        beneficiaryInputs.appendChild(beneficiaryName);
  
        // input field 2: beneficiary relationship
        const beneficiaryRelationship = createHTMLElement({
          element: 'div',
          attributes: { class: 'form-floating mt-3' }
        });
        beneficiaryRelationship.appendChild(createHTMLElement({
          element: 'input',
          attributes: {
            name: `beneficiary${beneficiaryCount}RelationshipField`,
            id: `beneficiary${beneficiaryCount}RelationshipField`,
            placeholder: `Beneficiary ${beneficiaryCount}'s Relationship to Testator`,
            type: 'text',
            class: 'form-control',
            required: ''
          }
        }));
        beneficiaryRelationship.appendChild(createHTMLElement({
          element: 'label',
          attributes: { for: `beneficiary${beneficiaryCount}RelationshipField` },
          text: `Beneficiary ${beneficiaryCount}'s Relationship to Testator`
        }));
        beneficiaryInputs.appendChild(beneficiaryRelationship);
  
        return beneficiaryInputs;
      }
      document
        .querySelector('.beneficiariesFieldset')
        .appendChild(inputFieldsforBeneficiary());
    }
    document
      .querySelector('#addBeneficiaryBtn')
      .addEventListener('click', addBeneficiaryHandler);

    // Event listener for <button> Remove Beneficiary
    function removeBeneficiaryHandler() {
      // Decrement beneficiary count
      if (beneficiaryCount >= 1) {
        beneficiaryCount -= 1;
        // Update form
        const beneficiariesFieldset = document.querySelector('.beneficiariesFieldset');
        beneficiariesFieldset.removeChild(beneficiariesFieldset.lastChild);
      }
    }
    document
      .querySelector('#removeBeneficiaryBtn')
      .addEventListener('click', removeBeneficiaryHandler);
  }
}

// Event listener for first radio button
function residueEqualHandler() {
  createBeneficiariesFieldset();
}
document
  .querySelector('#residueEqual')
  .addEventListener('change', residueEqualHandler);

// Event listener for second radio button
function residuePercentHandler() {
  createBeneficiariesFieldset();
}
document
  .querySelector('#residuePercent')
  .addEventListener('change', residuePercentHandler);

// Event listener for third radio button
function residuePerStirpesHandler() {
  // Remove beneficiaries fieldset if it exists
  if (document.querySelector('.beneficiariesFieldset')) {
    document.querySelector('.beneficiariesFieldset').remove();
  }

  // Add children fieldset if it doesn't exist
  function childrenFieldsetHTML() {
    // <fieldset>
    const fieldset = createHTMLElement({
      element: 'fieldset',
      attributes: { class: 'childrenFieldset mb-3' }
    });
  
    // <legend> Children
    fieldset.appendChild(
      createHTMLElement({
        element: 'legend',
        text: 'Children'
      })
    );
  
    // <button> Add Child
    fieldset.appendChild(
      createHTMLElement({
        element: 'button',
        attributes: {
          type: 'button',
          class: 'btn btn-outline-primary me-1',
          id: 'addChildBtn'
        },
        text: 'Add Child'
      })
    );
  
    // <button> Remove Child
    fieldset.appendChild(
      createHTMLElement({
        element: 'button',
        attributes: {
          type: 'button',
          class: 'btn btn-outline-secondary',
          id: 'removeChildBtn'
        },
        text: 'Remove Child'
      })
    );
  
    return fieldset;
  }
  if (!document.querySelector('.childrenFieldset')) {
    document
      .querySelector('#residuaryFieldset')
      .after(childrenFieldsetHTML());
  }

  // Keep track of child count and ids
  let childCount = 0;
  let childIds = [];

  // Event listener for <button> Add Child
  function addChildHandler() {
    // Increment childCount, record the new child's id
    childCount += 1;
    childIds.push(`childName${childCount}`);
    
    // Create input field for new child
    function inputFieldForChildName() {
      // <div>
      const divWrapper = createHTMLElement({
        element: 'div',
        attributes: { class: 'form-floating mt-3' }
      });

      // <input>
      divWrapper.appendChild(
        createHTMLElement({
          element: 'input',
          attributes: {
            name: `childName${childCount}Field`,
            id: `childName${childCount}Field`,
            placeholder: `Child ${childCount}'s Full Name`,
            type: 'text',
            class: 'form-control',
            required: ''
          }
        })
      );

      // <label>
      divWrapper.appendChild(
        createHTMLElement({
          element: 'label',
          attributes: { for: `childName${childCount}Field` },
          text: `Child ${childCount}'s Full Name`
        })
      );

      return divWrapper;
    };
    document
      .querySelector('.childrenFieldset')
      .appendChild(inputFieldForChildName());

    // Create child clause in preview panel if this is the first child
    if (childCount === 1) {
      function childClause() {
        // <li>
        const li = createHTMLElement({
          element: 'li',
          attributes: { class: 'childrenClauseDisplay' }
        });

        // <span> subclause-header
        li.appendChild(
          createHTMLElement({
            element: 'span',
            attributes: { class: 'subclause-header' },
            text: 'Children'
          })
        );

        // <span> childCountDisplay
        li.appendChild(
          createHTMLElement({
            element: 'span',
            attributes: { class: 'childCountDisplay' }
          })
        );

        // <span> childNamesDisplay
        li.appendChild(
          createHTMLElement({
            element: 'span',
            attributes: { class: 'childNamesDisplay' }
          })
        );

        li.append('. All references in this Will to "my children" are to them and to all children hereafter born to or adopted by me. In addition, all references in this Will to "my Descendants" are to my children (as defined above) and to all of their respective Descendants.');
    
        return li;
      }
      document.querySelector('#identificationList').appendChild(childClause());
    }

    updateChildCount();
    updatePlaceholdersforChildName();
  }
  document
    .querySelector('#addChildBtn')
    .addEventListener('click', addChildHandler);

  // Event listener for <button> Remove Child
  function removeChildHandler() {
    // Decrement child count, delete id of last child, remove input field
    if (childCount >= 1) {
      childCount -= 1;
      childIds.pop();

      // Update form
      const childrenFieldset = document.querySelector('.childrenFieldset');
      childrenFieldset.removeChild(childrenFieldset.lastChild);

      // Update display
      if (childCount === 0) {
        document.querySelector('.childrenClauseDisplay').remove();
      } else {
        updateChildCount();
        updatePlaceholdersforChildName();
      }
    }
  }
  document
    .querySelector('#removeChildBtn')
    .addEventListener('click', removeChildHandler);

  // Helper function to update child count in the preview
  function updateChildCount() {
    const childCountDisplay = document.querySelector('.childCountDisplay');
    if (childCount === 1) {
      childCountDisplay.textContent = `. I have 1 child, `;
    } else if (childCount > 1) {
      childCountDisplay.textContent = `. I have ${childCount} children, `;
    }
  }

  // Helper function to update child names in the preview
  function updatePlaceholdersforChildName() {
    function addDisplayPlaceholderForInput(parent, inputFieldId) {
      const placeholder = createHTMLElement({
        element: 'span',
        attributes: { class: `${inputFieldId}Display` }
      })
      parent.appendChild(placeholder);
    }
    const childNamesDisplay = document.querySelector('.childNamesDisplay');

    // Reset the names
    childNamesDisplay.textContent = '';

    // Grammatically add a display placeholder for each child input
    if (childCount === 1) {
      addDisplayPlaceholderForInput(childNamesDisplay, childIds[0]);
    } else if (childCount === 2) {
      addDisplayPlaceholderForInput(childNamesDisplay, childIds[0]);
      childNamesDisplay.append(' and ');
      addDisplayPlaceholderForInput(childNamesDisplay, childIds[1]);
    } else if (childCount > 2) {
      childIds.forEach((value, index, array) => {
        if (index === array.length - 1) {
          childNamesDisplay.append(' and ');
          addDisplayPlaceholderForInput(childNamesDisplay, array[index]);
        } else {
          addDisplayPlaceholderForInput(childNamesDisplay, array[index]);
          childNamesDisplay.append(', ');
        }
      });
    }

    childIds.forEach(childId => {
      // Retain existing names when altering number of children
      const childNameField = document.querySelector(`#${childId}Field`);
      const childNameDisplay = document.querySelectorAll(`.${childId}Display`);
      childNameDisplay.forEach(element => element.textContent = childNameField.value);
      // Autofill each display placeholder
      autofill(`${childId}`);
    });
  }
}
document
  .querySelector('#residuePerStirpes')
  .addEventListener('change', residuePerStirpesHandler);

// ##### PREVIEW-AS-YOU-TYPE #####
// todo - consider using the keys from sampleData.json?
(function () {
  const fieldNames = [
    'testatorName',
    'testatorCounty',
    'testatorState',
    'firstWitnessName',
    'firstWitnessAddress',
    'secondWitnessName',
    'secondWitnessAddress',
    'day',
    'month',
    'year'
  ]
  fieldNames.forEach(fieldName => autofill(fieldName));
})();

// ##### ADD SAMPLE DATA BUTTON #####
// On click, add sample data and update preview
// sampleData is exported from server to client via an embedded script in index
(function () {
  const sampleButton = document.querySelector('#sampleButton');
  sampleButton.addEventListener('click', (event) => {
    for (const key in sampleData) {
      const attributeField = document.querySelector(`#${key}Field`);
      attributeField.value = sampleData[key];

      const attributeDisplay = document.querySelectorAll(`.${key}Display`);
      attributeDisplay.forEach(attr => {
        attr.textContent = attributeField.value;
      })
    }
    // Todo - add functionality for charity clause?
    // document.querySelector('#givingToCharityField').checked = true;
    event.preventDefault();
  })
})();

// ##### RESET BUTTON #####
// On click, reset both the form and the preview
// Todo - fix reset button's interaction with childrenfieldset
(function () {
  const resetButton = document.querySelector('#resetButton');
  resetButton.addEventListener('click', () => {
    const displayElements = document.querySelectorAll("[class$='Display']");

    displayElements.forEach(element => {
      element.textContent = '';
    });
  });
})();