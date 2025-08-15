'use strict';

angular.module('myApp', [
  'ngRoute',
  'expenseModule',
  'addFormModule'
])
  .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
      .when('/expense', {
        templateUrl: 'modules/expense/expense.view.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/expense' });
  }])
  .controller('MainController', ['$http', function ($http) {
    var vm = this;
    vm.newRecord = {};            // Инициализация объекта для формы
    vm.records = [];              // Инициализация массива записей
    vm.isFormVisible = false;     // Переменная, отвечающая за видимость формы
    vm.amountSortOrder = 'desc';  // Сортировка по сумме
    vm.dateSortOrder = 'desc';    // Сортировка по дате
    vm.monthlyChart = null;       // Инициализация диаграммы

    // Функция открытия формы для добавления записей
    vm.openForm = function () {
      vm.isFormVisible = true;
    };

    // Функция закрытия формы добавления записей
    vm.closeForm = function () {
      vm.isFormVisible = false;
    };

    // Функция добавления записей
    vm.addRecord = function (recordData) {
      const recordToAdd = {
        description: recordData.description,
        amount: parseFloat(recordData.amount),
        expenseDate: recordData.expenseDate || new Date().toISOString().split('T')[0]
      };

      // Отправка на сервер
      return $http.post('https://localhost:7116/Expense', recordToAdd)
        .then(response => {
          const serverRecord = response.data;
          const added = {
            expenseId: serverRecord,
            description: recordToAdd.description,
            amount: recordToAdd.amount,
            expenseDate: recordToAdd.expenseDate
          }
          vm.records.unshift(added);
          console.log('Запись успешно добавлена:', added);
          vm.sortRecords();
          vm.showMonthlyStats();
          vm.newRecord = {
            description: '',
            amount: null,
            expenseDate: new Date().toISOString().split('T')[0]
          };

          return serverRecord;
        })
        .catch(error => {
          console.error('Ошибка добавления:', error);
          alert('Не удалось добавить запись');
          throw error;
        });
    };

    // Функция для обновления записи
    vm.updateRecord = function (updatedRecord) {
      if (!updatedRecord.expenseId) {
        return Promise.reject('Не указан ID записи');
      }
      const recordToSend = {
        expenseId: updatedRecord.expenseId,
        description: updatedRecord.description,
        amount: updatedRecord.amount,
        expenseDate: updatedRecord.expenseDateInput
      };
      const originalRecord = vm.records.find(r => r.expenseId === updatedRecord.expenseId);
      if (!originalRecord) return Promise.reject('Запись не найдена');
      originalRecord.expenseDate = recordToSend.expenseDate;

      Object.assign(originalRecord, {
        description: recordToSend.description,
        amount: recordToSend.amount,
        expenseDate: new Date(recordToSend.expenseDate)
      });
      //Отправка обновлённых данных на сервер
      return $http.put('https://localhost:7116/Expense/' + updatedRecord.expenseId, recordToSend)
        .then(response => {
          vm.showMonthlyStats();
          console.log("Обновлённые данные:", originalRecord)
          return originalRecord;
        })
        .catch(error => {
          console.error('Ошибка:', error);
          throw error;
        });
    };

    // Функция удаления записи
    vm.deleteRecord = function (recordToDelete) {
      if (!recordToDelete?.expenseId) {
        console.error('Ошибка: не указан ID записи');
        return Promise.reject('Не указан ID записи');
      }

      if (recordToDelete.expenseId.startsWith('temp_')) {
        vm.records = vm.records.filter(r => r.expenseId !== recordToDelete.expenseId);
        vm.sortRecords();
        vm.showMonthlyStats();
        return Promise.resolve();
      }

      if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
        return Promise.reject('Отменено пользователем');
      }
      //Отправка запроса на сервер
      return $http.delete('https://localhost:7116/Expense/' + recordToDelete.expenseId)
        .then(() => {
          vm.records = vm.records.filter(r => r.expenseId !== recordToDelete.expenseId);
          vm.sortRecords();
          vm.showMonthlyStats();
          console.log('Запись удалена:', recordToDelete.expenseId);
        })
        .catch(error => {
          if (error.status === 404) {
            console.warn('Запись не найдена на сервере, удаляем локально');
            vm.records = vm.records.filter(r => r.expenseId !== recordToDelete.expenseId);
            vm.sortRecords();
            vm.showMonthlyStats();
          } else {
            console.error('Ошибка удаления:', error);
            alert('Не удалось удалить запись');
            throw error;
          }
        });
    };

    // Функция получения записей
    vm.loadData = function () {
      return $http.get('https://localhost:7116/Expense')
        .then(function (response) {
          vm.records = response.data.map(item => ({
            ...item,
            expenseDate: new Date(item.expenseDate)
          }));
          console.log("Данные загружены", vm.records);
          vm.sortRecords();
          return vm.records;
        })
        .catch(function (error) {
          console.error('Ошибка загрузки:', error);
          throw error;
        });
    };

    // Функция для разделения данных на колонки
    vm.splitIntoColumns = function () {
      vm.leftColumn = [];
      vm.rightColumn = [];

      vm.sortedRecords.forEach((record, index) => {
        if (index % 2 === 0) {
          vm.leftColumn.push(record);
        } else {
          vm.rightColumn.push(record);
        }
      });
    };

    // Общая функция сортировки
    vm.sortRecords = function () {
      if (vm.currentSort === 'amount') {
        vm.sortedRecords = vm.records.slice().sort((a, b) => {
          return vm.amountSortOrder === 'asc'
            ? a.amount - b.amount
            : b.amount - a.amount;
        });
      } else {
        vm.sortedRecords = vm.records.slice().sort((a, b) => {
          return vm.dateSortOrder === 'asc'
            ? a.expenseDate - b.expenseDate
            : b.expenseDate - a.expenseDate;
        });
      }

      vm.splitIntoColumns();
    };

    // Функция сортировки по сумме
    vm.sortByAmount = function () {
      vm.currentSort = 'amount';
      vm.amountSortOrder = vm.amountSortOrder === 'asc' ? 'desc' : 'asc';
      vm.sortRecords();
    };

    // Функция сортировки по дате
    vm.sortByDate = function () {
      vm.currentSort = 'date';
      vm.dateSortOrder = vm.dateSortOrder === 'asc' ? 'desc' : 'asc';
      vm.sortRecords();
    };

    // Функция отображения диаграммы
    vm.showMonthlyStats = function () {
      if (!vm.records || vm.records.length === 0) {
        console.warn("Нет данных для графика");
        return;
      }
      // Удаление предыдущего графика, если он существует
      if (vm.monthlyChart) {
        vm.monthlyChart.destroy();
        vm.monthlyChart = null;
      }
      const ctx = document.getElementById('monthlyStatsChart');
      if (!ctx) {
        console.error("Элемент для графика не найден");
        return;
      }

      //Группировка данных по месяцам
      const monthlyData = {};
      vm.records.forEach(record => {
        const date = new Date(record.expenseDate);
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            total: 0,
            month: date.getMonth(),
            year: date.getFullYear()
          };
        }
        monthlyData[monthYear].total += record.amount;
      });

      const sortedMonths = Object.values(monthlyData)
        .sort((a, b) => a.year - b.year || a.month - b.month);
      const labels = sortedMonths.map(item =>
        `${vm.getMonthName(item.month)} ${item.year}`);
      const data = sortedMonths.map(item => item.total);

      // Создание нового графика
      vm.monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Траты по месяцам',
            data: data,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56'
            ],
            borderColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Сумма (руб)' }
            },
            x: {
              title: { display: true, text: 'Месяц' }
            }
          }
        }
      });
    };

    // Вспомогательная функция для названия месяца
    vm.getMonthName = function (monthIndex) {
      const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];
      return months[monthIndex];
    };

    vm.loadData().then(() => vm.showMonthlyStats());
  }]
  );