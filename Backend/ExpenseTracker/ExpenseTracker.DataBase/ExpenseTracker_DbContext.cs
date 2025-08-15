using ExpenseTracker.DataBase.Configurations;
using ExpenseTracker.DataBase.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.DataBase
{
    public class ExpenseTracker_DbContext : DbContext
    {
        public ExpenseTracker_DbContext(DbContextOptions<ExpenseTracker_DbContext> options) : base(options) { }
        public DbSet<ExpenseEntity> ExpenseEntities { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ExpenseConfiguration());
            base.OnModelCreating(modelBuilder);
        }

    }
}
