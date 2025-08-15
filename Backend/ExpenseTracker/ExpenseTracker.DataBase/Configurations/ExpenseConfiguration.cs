using ExpenseTracker.DataBase.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExpenseTracker.DataBase.Configurations
{
    public class ExpenseConfiguration : IEntityTypeConfiguration<ExpenseEntity>
    {
        public void Configure(EntityTypeBuilder<ExpenseEntity> builder)
        {
            builder.HasKey(e => e.ExpenseId);
        }
    }
}
