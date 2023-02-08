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

// Add <span> to display panel to reflect form inputs
function addDisplayPlaceholderForInput(parent, inputFieldId) {
  const placeholder = createHTMLElement({
    element: 'span',
    attributes: { class: `${inputFieldId}Display` }
  })
  parent.appendChild(placeholder);
}

// ##### DISTRIBUTION OF RESIDUARY ESTATE #####
// Keep track of number of beneficiaries
let beneficiaryCount;

// Removes children fieldset and display, add beneficiary fieldset and display for id article
// Used by the first two radio buttons
function createBeneficiariesFieldsetAndDisplay() {
  // Remove beneficiaries fieldset if it exists
  if (document.querySelector('.beneficiariesFieldset')) {
    document.querySelector('.beneficiariesFieldset').remove();
  }

  // Remove children fieldset if it exists
  if (document.querySelector('.childrenFieldset')) {
    document.querySelector('.childrenFieldset').remove();
  }
  
  // Delete everything from Identification Article
  document.querySelector('#identificationList').innerHTML = '';
  
  // Add beneficiaries fieldset (without input field) if it doesn't exist
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
  
    beneficiaryCount = 0;

    // Event listener for <button> Add Beneficiary
    function addBeneficiaryHandler() {
      // Increment beneficiaryCount
      beneficiaryCount += 1;
  
      // Create input fields for beneficiary
      function beneficiaryInputFieldsHTML() {
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
        .appendChild(beneficiaryInputFieldsHTML());

      // Create clause for preview panel
      function beneficiaryIdDisplayHTML() {
        const listElement = createHTMLElement({
          element: 'li',
          attributes: { id: `beneficiary${beneficiaryCount}Display` }
        });
        const subclauseHeader = createHTMLElement({
          element: 'span',
          attributes: { class: 'subclause-header' }
        });
        addDisplayPlaceholderForInput(subclauseHeader, `beneficiary${beneficiaryCount}Name`);
        listElement.append(subclauseHeader, '. I have included my ');
        addDisplayPlaceholderForInput(listElement, `beneficiary${beneficiaryCount}Relationship`);
        listElement.append(', ');
        addDisplayPlaceholderForInput(listElement, `beneficiary${beneficiaryCount}Name`);
        listElement.append(', as a beneficiary in this Will.');
        return listElement;
      }
      document.querySelector('#identificationList').appendChild(beneficiaryIdDisplayHTML());

      autofill(`beneficiary${beneficiaryCount}Name`);
      autofill(`beneficiary${beneficiaryCount}Relationship`);
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
        
        // Update display
        document.querySelector('#identificationList').lastChild.remove();
      }
    }
    document
      .querySelector('#removeBeneficiaryBtn')
      .addEventListener('click', removeBeneficiaryHandler);
  }
}

// Event listener for first radio button
function residueEqualHandler() {
  // Remove percentage fieldset if it exists
  if (document.querySelector('#percentageFieldset')) {
    document.querySelector('#percentageFieldset').remove();
  }

  createBeneficiariesFieldsetAndDisplay();

  // const idList = document.querySelector('#identificationList');
  // idList.innerHTML += '<li class="beneficiaryDisplay">Hello World</li>'
}
document
  .querySelector('#residueEqual')
  .addEventListener('change', residueEqualHandler);

// Event listener for second radio button
function residuePercentHandler() {
  createBeneficiariesFieldsetAndDisplay();
  
  // Additional event listener for add beneficiary button
  // This handler adds input fields to determine the distribution percentages
  function addBeneficiaryHandlerForPercentage() {
    // Add percent fieldset if it doesn't exist
    function percentageFieldsetHTML() {
      const fieldset = createHTMLElement({
        element: 'fieldset',
        attributes: { id: 'percentageFieldset' }
      });
      fieldset.appendChild(createHTMLElement({
        element: 'legend',
        text: 'Distribution Percentage'
      }));
      return fieldset;
    }
    if (!document.querySelector('#percentageFieldset')) {
      document.querySelector('.beneficiariesFieldset').after(percentageFieldsetHTML());
    }

    // Add input group to determine how much a beneficiary should receive in %
    function percentageInputHTML() {
      const inputGroup = createHTMLElement({
        element: 'div',
        attributes: { class: 'input-group mb-3' }
      });
  
      // Prepend
      inputGroup.appendChild(createHTMLElement({
        element: 'span',
        attributes: { class: 'input-group-text' },
        text: `Beneficiary ${beneficiaryCount}`
      }));
  
      // <input>
      inputGroup.appendChild(createHTMLElement({
        element: 'input',
        attributes: { type: 'number', class: 'form-control', max: '100', required: '' }
      }));
  
      // Append
      inputGroup.appendChild(createHTMLElement({
        element: 'span',
        attributes: { class: 'input-group-text' },
        text: '%'
      }));
  
      return inputGroup;
    }
    document.querySelector('#percentageFieldset').appendChild(percentageInputHTML());
  }
  document
    .querySelector('#addBeneficiaryBtn')
    .addEventListener('click', addBeneficiaryHandlerForPercentage);

  // Additional event listener for remove beneficiary button
  // This handler removes the distribution percentage fieldset
  function removeBeneficiaryHandlerForPercentage() {
    const percentageFieldset = document.querySelector('#percentageFieldset');
    if (beneficiaryCount >= 1) {
      percentageFieldset.lastChild.remove();
    }
    if (beneficiaryCount === 0 && percentageFieldset) {
      percentageFieldset.remove();
    }
  }
  document
    .querySelector('#removeBeneficiaryBtn')
    .addEventListener('click', removeBeneficiaryHandlerForPercentage);
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

  // Delete everything from Identification Article
  document.querySelector('#identificationList').innerHTML = '';
  
  // Remove percentage fieldset if it exists
  if (document.querySelector('#percentageFieldset')) {
    document.querySelector('#percentageFieldset').remove();
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
      function childClauseHTML() {
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
      document.querySelector('#identificationList').appendChild(childClauseHTML());
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