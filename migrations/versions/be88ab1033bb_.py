"""empty message

Revision ID: be88ab1033bb
Revises: 1ff958f966ae
Create Date: 2021-04-19 22:30:09.063728

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'be88ab1033bb'
down_revision = '1ff958f966ae'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('Cars_user_id_fkey', 'Cars', type_='foreignkey')
    op.drop_column('Cars', 'user_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Cars', sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.create_foreign_key('Cars_user_id_fkey', 'Cars', 'Users', ['user_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###