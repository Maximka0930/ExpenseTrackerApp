angular.module('expenseModule', [])
  .filter('formatDate', function () {
    return function (dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}.${month}.${date.getFullYear()}`;
    };
  })
  .directive('beautifulRecord', function () {
    return {
      restrict: 'E',
      scope: {
        recordData: '=',
        onUpdate: '&',
        onDelete: '&'
      },
      templateUrl: 'modules/expense/expense.view.html',
      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.isEditMode = false;
        vm.editedRecord = {};
        vm.errors = {};
        vm.formTouched = false;

        // Валидация полей
        vm.validate = function (field) {
          switch (field) {
            case 'description':
              if (!vm.editedRecord.description) {
                vm.errors.description = 'Введите описание';
              } else if (vm.editedRecord.description.length > 100) {
                vm.errors.description = 'Максимум 100 символов';
              } else {
                delete vm.errors.description;
              }
              break;

            case 'amount':
              if (vm.editedRecord.amount === null || vm.editedRecord.amount === '') {
                vm.errors.amount = 'Введите сумму';
              } else if (vm.editedRecord.amount <= 0) {
                vm.errors.amount = 'Сумма должна быть больше 0';
              } else if (vm.editedRecord.amount > 1000000000) {
                vm.errors.amount = 'Слишком большая сумма';
              } else {
                delete vm.errors.amount;
              }
              break;

            case 'expenseDate':
              if (!vm.editedRecord.expenseDateInput) {
                vm.errors.expenseDate = 'Выберите дату';
              } else {
                try {
                  const selectedDate = new Date(vm.editedRecord.expenseDateInput);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (isNaN(selectedDate.getTime())) {
                    vm.errors.expenseDate = 'Некорректная дата';
                  } else if (selectedDate > today) {
                    vm.errors.expenseDate = 'Дата не может быть в будущем';
                  } else {
                    delete vm.errors.expenseDate;
                  }
                } catch (e) {
                  vm.errors.expenseDate = 'Ошибка проверки даты';
                }
              }
              break;
          }
        };

        // Проверка валидности всей формы
        vm.isFormInvalid = function () {
          vm.validate('description');
          vm.validate('amount');
          vm.validate('expenseDate');

          return Object.keys(vm.errors).length > 0 ||
            !vm.editedRecord.description ||
            vm.editedRecord.amount === null ||
            !vm.editedRecord.expenseDateInput;
        };

        // Обработчик изменений полей
        vm.onFieldChange = function (field) {
          vm.validate(field);
        };

        // Переключение режима редактирования
        vm.toggleEditMode = function () {
          vm.isEditMode = !vm.isEditMode;
          vm.formTouched = false;
          if (vm.isEditMode) {
            vm.editedRecord = angular.copy(vm.recordData);
            vm.editedRecord.expenseDateInput = null;
          }
        };

        // Отправка формы
        vm.submitForm = function () {
          vm.formTouched = true;
          if (!vm.isFormInvalid()) {
            $scope.$parent.vm.updateRecord(vm.editedRecord);
            vm.isEditMode = false;
          }
        };

        // Удаление записи
        vm.deleteRecord = function () {
          $scope.$parent.vm.deleteRecord(vm.recordData);
        };
      }],
      controllerAs: 'vm',
      bindToController: true
    };
  })