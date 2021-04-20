"""empty message

Revision ID: 558b290c1a08
Revises: be88ab1033bb
Create Date: 2021-04-19 22:35:36.791031

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '558b290c1a08'
down_revision = 'be88ab1033bb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Cars', sa.Column('user_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'Cars', 'Users', ['user_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'Cars', type_='foreignkey')
    op.drop_column('Cars', 'user_id')
    # ### end Alembic commands ###