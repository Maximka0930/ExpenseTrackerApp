angular.module('addFormModule', [])
    .directive('addExpenseForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/formToAddExpense/addform.view.html',
            scope: {
                isVisible: '=',
                onClose: '&',
                onAdd: '&',
                newRecord: '='
            },
            controller: function () {
                var formVm = this;

                formVm.newRecord = angular.copy(formVm.newRecord) || {
                    description: '',
                    amount: null,
                    expenseDate: new Date().toISOString().split('T')[0]
                };

                formVm.errors = {};

                // Валидация полей
                formVm.validate = function (field) {
                    switch (field) {
                        case 'description':
                            if (!formVm.newRecord.description) {
                                formVm.errors.description = 'Введите описание';
                            } else if (formVm.newRecord.description.length > 100) {
                                formVm.errors.description = 'Максимум 100 символов';
                            } else {
                                delete formVm.errors.description;
                            }
                            break;

                        case 'amount':
                            if (formVm.newRecord.amount === null || formVm.newRecord.amount === '') {
                                formVm.errors.amount = 'Введите сумму';
                            } else if (formVm.newRecord.amount <= 0) {
                                formVm.errors.amount = 'Сумма должна быть больше 0';
                            } else if (formVm.newRecord.amount > 1000000000) {
                                formVm.errors.amount = 'Слишком большая сумма';
                            } else {
                                delete formVm.errors.amount;
                            }
                            break;

                        case 'expenseDate':
                            if (!formVm.newRecord.expenseDate) {
                                formVm.errors.expenseDate = 'Выберите дату';
                            } else {
                                var selectedDate = new Date(formVm.newRecord.expenseDate);
                                var today = new Date();
                                today.setHours(0, 0, 0, 0);

                                if (selectedDate > today) {
                                    formVm.errors.expenseDate = 'Дата не может быть в будущем';
                                } else {
                                    delete formVm.errors.expenseDate;
                                }
                            }
                            break;
                    }
                };

                // Проверка валидности всей формы
                formVm.isFormInvalid = function () {
                    formVm.validate('description');
                    formVm.validate('amount');
                    formVm.validate('expenseDate');
                    return Object.keys(formVm.errors).length > 0 ||
                        !formVm.newRecord.description ||
                        formVm.newRecord.amount === null ||
                        !formVm.newRecord.expenseDate;
                };

                // Обработчик изменений полей
                formVm.onFieldChange = function (field) {
                    formVm.validate(field);
                };

                // Отправка формы
                formVm.submit = function () {
                    if (!formVm.isFormInvalid()) {
                        const recordToSend = {
                            description: formVm.newRecord.description,
                            amount: formVm.newRecord.amount,
                            expenseDate: formVm.newRecord.expenseDate
                        };
                        formVm.onAdd({ record: recordToSend });
                        formVm.onClose();
                    }
                };
            },
            controllerAs: 'formVm',
            bindToController: true
        };
    });